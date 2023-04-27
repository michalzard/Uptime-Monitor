import { Request, Response, NextFunction } from "express";
import { createId } from "@paralleldrive/cuid2";
import * as argon2 from "argon2";
import { db } from "..";
import { checkExistingUser, deleteSessionByToken, findSessionByToken, findUserByPrimaryKey, findUserByUsername, registerUser, saveToSession } from "../sql/authQuery";
import axios from "axios";

export async function userRegistration(req: Request, res: Response) {
    const { username, email, password } = req.body;
    try {
        const existingUser = await db.query(checkExistingUser, [username, email]);
        if (existingUser.rowCount > 0) {
            res.status(400).send({ message: "Username or email is already in use." });
        } else {
            const hashedPassword = await argon2.hash(password);
            const generatedId = createId();
            const registeredUser = await db.query(registerUser, [username, email, hashedPassword, null]);
            if (registeredUser.rowCount === 0) return res.status(400).send({ message: "Bad Request" });
            else {
                const user = registeredUser.rows[0];
                const { pk, ...filteredUser } = user;
                // save user to session
                await db.query(saveToSession, [generatedId, pk, "normal"]);
                // create session object with user id,current timestamp,generated Token that will be passed trough authorization header for client to save 
                setHTTPOnlyCookie(res, "sessionID", generatedId);
                res.status(200).send({ message: "User Registered", user: filteredUser });
            }
        }
    } catch (err) {
        // handle error
        console.log(err);
        if (err instanceof Error) {
            if (err.message.includes("duplicate")) {
                res.status(400).send({ message: "Username or email is already in use." });
            } else {
                res.status(500).send({ message: "Internal Server Error" });
            }
        }
    }
}

export async function userLogin(req: Request, res: Response) {
    const { username, password } = req.body;
    try {
        if (!username || !password) return res.status(400).send({ message: "Username and password are required" });
        const users = await db.query(findUserByUsername, [username]);
        const foundUser = users.rows[0];//first result
        if (foundUser) {
            const isValidPassword = await argon2.verify(foundUser.password, password);
            if (isValidPassword) {
                const { pk, password, ...user } = foundUser; //loaded from db
                const generatedId = createId();
                await db.query(saveToSession, [generatedId, pk, "normal"]);
                setHTTPOnlyCookie(res, "sessionID", generatedId);
                res.status(200).send({ message: "User logged in", user });
            } else {
                res.status(401).send({ message: "Username or password is incorrect" });
            }
        } else {
            res.status(401).send({ message: "Username or password is incorrect" });
        }
    } catch (err) {
        // handle error
        console.log(err);
        res.status(500).send({ message: "Internal Server Error" });
    }
}
export async function userLogout(req: Request, res: Response) {
    const cookies = readCookiesFromHeaders(req);

    try {
        if (!cookies?.sessionID) return res.status(401).send({ message: "Unauthorized" });
        db.query(deleteSessionByToken, [cookies?.sessionID]).then(dbres => {
            res.clearCookie("sessionID");
            res.status(200).send({ message: "Logged out" });
        }).catch(err => {
            console.log(err);
            res.clearCookie("sessionID");
            res.status(404).send({ message: "Token expired" });
        })
    } catch (err) {
        // handle error
        console.log(err);
        res.status(500).send({ message: "Internal Server Error" });
    }
}

export async function userSession(req: Request, res: Response) {
    const cookies = readCookiesFromHeaders(req);
    try {
        // TODO: add handler for diff services
        if (!cookies?.sessionID) { return res.status(401).send({ message: "Unauthorized" }); }
        const sessions = await db.query(findSessionByToken, [cookies?.sessionID]);
        const session = sessions.rows[0];
        if (session) {
            const userPK = session.user_pk;
            const sessionUserByPK = await db.query(findUserByPrimaryKey, [userPK]);
            const foundUser = sessionUserByPK.rows[0];
            console.log(foundUser);
            const { username, email, avatar_url } = foundUser;
            res.status(200).send({ message: "Authorized", user: { username, email, avatar_url, service: session.service } });
        } else {
            res.clearCookie("sessionID");
            res.status(304).send({ message: "Unauthorized" });
        }
    } catch (err) {
        // handle error
        console.log(err);
        res.status(500).send({ message: "Internal Server Error" });
    }
}

export async function userGithubAccess(req: Request, res: Response) {
    const { code } = req.body;
    try {
        if (!code) return res.status(404).send({ message: "Specify github code" });
        else {
            const githubAccessTokenURL = `https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${code}&redirect_uri=${process.env.GITHUB_CALLBACK_URL}`;
            axios.post(githubAccessTokenURL, {}, {
                headers: {
                    Accept: "application/json"
                }
            }).then(json => {
                // if(res.data.includes())
                const { error_description, access_token } = json.data;
                if (error_description) res.status(304).send({ message: error_description });
                else {
                    if (access_token) {
                        axios.post(`https://api.github.com/user`, {}, {
                            headers: {
                                Authorization: `Bearer ${access_token}`,
                                Accept: "application/json"
                            }
                        }).then(async json => {
                            // github data
                            const { login, id: githubID, avatar_url } = json.data;

                            const { data } = await axios.get("https://api.github.com/user/emails", {
                                headers: {
                                    Authorization: `Bearer ${access_token}`,
                                    Accept: "application/vnd.github+json",
                                }
                            });
                            //emails
                            if (data) {
                                const primaryEmail = data.filter((d: { primary: boolean }) => d.primary === true)[0].email;
                                //    check sessions first if github user doesnt already exist if not register him
                                const sessions = await db.query(findSessionByToken, [githubID]);
                                const foundSession = sessions.rows[0];
                                if (foundSession) {
                                    // return session back to client
                                    const { user_pk, token, service } = foundSession;
                                    const userQuery = await db.query(findUserByPrimaryKey, [user_pk]);
                                    const { username, email, avatar_url } = userQuery.rows[0];
                                    if (email) {
                                        setHTTPOnlyCookie(res, "sessionID", token);
                                        res.status(200).send({ message: "Github Authorized", user: { username, email, avatar_url, service } });
                                    }
                                    else res.status(401).send({ message: "Unauthorized" });
                                } else {
                                    // register
                                    const userQuery = await db.query(registerUser, [login, primaryEmail, null, avatar_url]);
                                    const user = userQuery.rows[0];
                                    if (user) {
                                        const { pk, username, email } = user;
                                        // session
                                        const sessions = await db.query(saveToSession, [githubID, pk, "github"]);
                                        const session = sessions.rows[0];
                                        if (session) {
                                            setHTTPOnlyCookie(res, "sessionID", session?.token);
                                            res.status(200).send({ message: "Github Authorized", user: { username, email, id: session?.token, service: session?.service } });
                                        } else {
                                            res.status(400).send({ message: "Bad Request" });
                                        }
                                    } else {
                                        res.status(400).send({ message: "Bad Request" });
                                    }
                                }
                            } else {
                                res.status(400).send({ message: "Bad Request" });
                            }
                        }).catch(err => {
                            console.log(err);
                            res.status(500).send({ message: err.message });
                        });
                    } else {
                        res.status(404).send({ message: "Github was unable to authorize access token" });
                    }
                }
            }).catch(console.log);
        }
    } catch (err) {
        // handle error
        console.log(err);
        res.status(500).send({ message: "Internal Server Error" });
    }
}

// Cookies Utils

/**
 * Sets name and value for Set-Cookie header
 * @param res express Response
 * @param name cookie name
 * @param value cookie value
 */
export function setHTTPOnlyCookie(res: Response, name: string, value: string) {
    res.cookie(name, value, { httpOnly: true, secure: process.env.NODE_ENV === "production" ? true : false });
}
/**
 * Reads cookies from request headers in order to parsed them into k,v pairs
 * @param req express Request
 * @returns Object with key,value pairs of all cookies
 */
export function readCookiesFromHeaders(req: Request) {
    const { cookie } = req.headers;
    const results: { [key: string]: string } = {};
    if (cookie) {
        const s = cookie.split(";");
        for (let i = 0; i < s.length; i++) {
            const cookie = s[i];
            const cSplit = cookie.split("=");
            if (cSplit) results[cSplit[0].trim()] = cSplit[1];
        }
    } else return null;
    return results;
}