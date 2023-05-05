import { Request, Response } from "express";
import axios from "axios";
import { db } from "..";
import { findSessionByToken, findUserByID, findUserByPrimaryKey, registerUser, saveToSession } from "../sql/authQuery";
import { setHTTPOnlyCookie } from "../utils/cookies";
import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();

export async function userGithubAccess(req: Request, res: Response) {
    const { code } = req.body;
    try {
        if (!code) return res.status(404).send({ message: "Specify github code" });
        else {
            const githubAccessTokenURL = `https://github.com/login/oauth/access_token?client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${code}&redirect_uri=${process.env.CLIENT_URL}/signin`;
            axios.post(githubAccessTokenURL, {}, {
                headers: {
                    Accept: "application/json"
                }
            }).then(json => {
                const { error_description, access_token } = json.data;
                if (error_description) res.status(404).send({ message: error_description });
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
                            const primaryEmail = data.filter((d: { primary: boolean }) => d.primary === true)[0].email;
                            // CHECK IF GITHUB ID is in any user object if yes login if not register
                            const userByGithubId = await db.query(findUserByID, [githubID]);
                            const githubUser = userByGithubId.rows[0];
                            if (githubUser) {
                                const { id, pk, username, email } = githubUser;
                                const saving = await db.query(saveToSession, [id, pk, "github"]);
                                const session = saving.rows[0];
                                // already exists return new session with existing data
                                if (session) {
                                    setHTTPOnlyCookie(res, "sessionID", id);
                                    res.status(200).send({ message: "Github Authorized", user: { username, email, service: session?.service } });
                                } else {
                                    res.status(404).send({ message: "Issue authorizing github user" });
                                }

                            } else {
                                // new user,create github id for user object
                                const registration = await db.query(registerUser, [login, primaryEmail, null, avatar_url, githubID]);
                                const user = registration.rows[0];
                                if (user) {
                                    const { pk, username, email } = user;
                                    const saving = await db.query(saveToSession, [githubID, pk, "github"]);
                                    const session = saving.rows[0];
                                    if (session) {
                                        setHTTPOnlyCookie(res, "sessionID", githubID);
                                        res.status(200).send({ message: "Github Authorized", user: { username, email, avatar_url, service: session.service } });
                                    } else {

                                    }
                                } else {
                                    res.status(404).send({ message: "Issue registering github user" });
                                }
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

// Google oAuth
const oauth2Client = new google.auth.OAuth2({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: `${process.env.CLIENT_URL}`,
});
const googleAccessScopes = [
    "https://www.googleapis.com/auth/userinfo.profile",
];
export async function userGoogleRequestLink(req: Request, res: Response) {
    try {
        const authorizationURL = oauth2Client.generateAuthUrl({
            access_type: "offline",
            scope: googleAccessScopes,
            include_granted_scopes: true,
            response_type: "code",
        });
        if (authorizationURL) {
            res.status(200).send({ message: "Google authorization url", location: authorizationURL });
        } else {
            res.status(404).send({ message: "There was some issue generating authorizationURL", location: null });
        }

    } catch (err) {
        // handle error
        if (err instanceof Error)
            console.log(err.message);
        res.status(500).send({ message: "Internal Server Error" });
    }
}

export async function userGoogleAccess(req: Request, res: Response) {
    const { code } = req.body;
    try {
        if (!code) return res.status(404).send({ message: "Bad Request" });
        const { tokens } = await oauth2Client.getToken(code);
        // get access and refresh tokens
        oauth2Client.setCredentials(tokens);
        const userInfoAPI = await google.oauth2({ version: "v2", auth: oauth2Client }).userinfo.get();
        const { data } = userInfoAPI;
        const { id, email, name, picture } = data;
        if (data) {

            if (id) {
                const isAlreayRegged = await db.query(findUserByID, [id]);
                const user = isAlreayRegged.rows[0];
                if (user) {
                    // create session and login

                    const saving = await db.query(saveToSession, [id, user.pk, "google"]);
                    const session = saving.rows[0];
                    const { token, service } = session;
                    if (session) {
                        const { pk, password, ...rest } = user;
                        setHTTPOnlyCookie(res, "sessionID", token);
                        res.status(200).send({ message: "Google user authorized", user: { ...rest, service } })
                    } else {
                        res.status(404).send({ message: "Bad Request" });
                    }
                } else {
                    // register
                    const registered = await db.query(registerUser, [name, email, null, picture, id]);
                    const user = registered.rows[0];
                    if (user) {
                        const { pk, username, email, avatar_url } = user;
                        const savingSession = await db.query(saveToSession, [id, pk, "google"]);
                        const session = savingSession.rows[0];
                        if (session) {
                            const { token, service } = session;
                            setHTTPOnlyCookie(res, "sessionID", token);

                            res.status(200).send({
                                message: "Google authorized", user: {
                                    username, email, avatar_url, service
                                }
                            });
                        } else {
                            res.status(404).send({ message: "Issue with saving user" });
                        }
                    }
                }

            } else {
                res.status(404).send({ message: "Issue with user authorization" });
            }
        } else {
            res.status(404).send({ message: "Bad Ruquest" });
        }

    } catch (err) {
        // handle error
        if (err instanceof Error)
            console.log(err.message);
        res.status(500).send({ message: "Internal Server Error" });
    }
}