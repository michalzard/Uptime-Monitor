import { Request, Response, NextFunction } from "express";
import { createId } from "@paralleldrive/cuid2";
import * as argon2 from "argon2";
import { db } from "..";
import { checkExistingUser, deleteSessionByToken, findSessionByToken, findUserByPrimaryKey, findUserByUsername, registerUser, saveToSession } from "../sql/authQuery";
import { readCookiesFromHeaders, setHTTPOnlyCookie } from "../utils/cookies";

export async function userRegistration(req: Request, res: Response) {
    const { username, email, password } = req.body;
    try {
        const existingUser = await db.query(checkExistingUser, [username, email]);
        if (existingUser.rowCount > 0) {
            res.status(400).send({ message: "Username or email is already in use." });
        } else {
            const hashedPassword = await argon2.hash(password);
            const registeredUser = await db.query(registerUser, [username, email, hashedPassword, null, createId()]);
            if (registeredUser.rowCount === 0) return res.status(400).send({ message: "Bad Request" });
            else {
                const user = registeredUser.rows[0];
                const { pk, ...filteredUser } = user;
                const sessionID = createId();
                // save user to session
                await db.query(saveToSession, [sessionID, pk, "normal"]);
                // create session object with user id,current timestamp,generated Token that will be passed trough authorization header for client to save 
                setHTTPOnlyCookie(res, "sessionID", sessionID);
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
            const isNormalUser = foundUser.password !== null;
            if (isNormalUser) {
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
                // google/github users
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

// FIXME:have session token be uuid and have it refreshed on expiry
export async function userSession(req: Request, res: Response) {
    const cookies = readCookiesFromHeaders(req);
    try {
        if (!cookies?.sessionID) { return res.status(401).send({ message: "Unauthorized" }); }
        const sessions = await db.query(findSessionByToken, [cookies?.sessionID]);
        const session = sessions.rows[0];
        if (session) {
            const userPK = session.user_pk;
            const sessionUserByPK = await db.query(findUserByPrimaryKey, [userPK]);
            const foundUser = sessionUserByPK.rows[0];
            const { username, email, avatar_url } = foundUser;

            res.status(200).send({ message: "Authorized", user: { username, email, avatar_url, service: session.service } });
        } else {
            res.clearCookie("sessionID");
            res.status(404).send({ message: "Unauthorized" });
        }
    } catch (err) {
        // handle error
        console.log(err);
        res.status(500).send({ message: "Internal Server Error" });
    }
}