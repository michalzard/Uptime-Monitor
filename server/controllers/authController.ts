import { Request, Response, NextFunction } from "express";
import { createId } from "@paralleldrive/cuid2";
import * as argon2 from "argon2";
import { db } from "..";
import { checkExistingUser, deleteSessionByToken, findSessionByToken, findUserByPrimaryKey, findUserByUsername, registerUser, saveToSession } from "../sql/authQuery";

export async function userRegistration(req: Request, res: Response) {
    const { username, email, password } = req.body;
    try {
        const existingUser = await db.query(checkExistingUser, [username, email]);
        if (existingUser.rowCount > 0) {
            res.status(400).send({ message: "Username or email is already in use." });
        } else {
            const hashedPassword = await argon2.hash(password);
            const generatedId = createId();
            const registeredUser = await db.query(registerUser, [username, email, hashedPassword, generatedId]);
            if (registeredUser.rowCount === 0) return res.status(400).send({ message: "Bad Request" });
            else {
                const user = registeredUser.rows[0];
                const { pk, ...filteredUser } = user;
                // save user to session
                await db.query(saveToSession, [generatedId, pk]);
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
                await db.query(saveToSession, [generatedId, pk]);

                setHTTPOnlyCookie(res, "sessionID", generatedId);
                res.status(200).send({ message: "User logged in", user });
            } else {
                res.status(401).send({ message: "Unauthorized" });
            }
        } else {
            res.status(401).send({ message: "Unauthorized" });
        }
    } catch (err) {
        // handle error
        console.log(err);
        res.status(500).send({ message: "Internal Server Error" });
    }
}

export async function userSession(req: Request, res: Response) {
    const cookies = readCookiesFromHeaders(req);

    try {
        // TODO:load sessionID from cookies
        if (!cookies?.sessionID) return res.status(401).send({ message: "Unauthorized" });
        const session = await db.query(findSessionByToken, [cookies?.sessionID]);
        if (session.rowCount > 0) {
            const userPK = session.rows[0].user_pk;
            const sessionUserByPK = await db.query(findUserByPrimaryKey, [userPK]);
            const foundUser = sessionUserByPK.rows[0];
            const { pk, password, ...user } = foundUser;
            res.status(200).send({ message: "Authorized", user });
        } else {
            res.clearCookie("sessionID");
            res.status(401).send({ message: "Unauthorized" });
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
        // TODO:load sessionID from cookies
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