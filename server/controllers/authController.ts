import { Request, Response, NextFunction } from "express";
import { createId } from "@paralleldrive/cuid2";
import * as argon2 from "argon2";
import { db } from "..";
import { checkExistingUser, deleteSessionByToken, findUserByUsername, registerUser, saveToSession, updateUserInfo, updateUserPassword } from "../sql/authQuery";
import { setHTTPOnlyCookie } from "../utils/cookies";

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
                res.status(200).send({ message: "User Registered", user: { ...filteredUser, service: "normal" } });
            }
        }
    } catch (err) {
        // handle error
        if (err instanceof Error) {
            console.log(err);
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
                    db.query(saveToSession, [generatedId, pk, "normal"]);
                    setHTTPOnlyCookie(res, "sessionID", generatedId);
                    res.status(200).send({ message: "User logged in", user: { ...user, service: "normal" } });
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
    try {
        db.query(deleteSessionByToken, [res.locals.sessionID]).then(dbres => {
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
    try {
        if (res.locals.user) {
            const { username, email, avatar_url, service } = res.locals.user;
            res.status(200).send({ message: "Authorized", user: { username, email, avatar_url, service: service } });
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

// update
export async function userUpdateInfo(req: Request, res: Response) {
    const { username, email } = req.body;
    try {
        if (!username || !email) return res.status(400).send({ message: "Both username and email is required" });
        else {
            const { pk } = res.locals.user;
            const updated = await db.query(updateUserInfo, [pk, username, email]);
            if (updated.rowCount > 0) res.status(200).send({ message: "User information updated" });
            else res.status(304).send();
        }
    } catch (err) {
        // handle error
        console.log(err);
        res.status(500).send({ message: "Internal Server Error" });
    }
}
export async function userUpdatePassword(req: Request, res: Response) {
    const { password } = req.body;
    try {
        if (!password) return res.status(400).send({ message: "Enter new password" });
        else {
            const { pk } = res.locals.user;
            const hashedPw = await argon2.hash(password);
            const updated = await db.query(updateUserPassword, [pk, hashedPw]);
            if (updated.rowCount > 0) res.status(200).send({ message: "User password updated" });
            else res.status(404).send({ message: "There was issue updating user password" });
        }
    } catch (err) {
        // handle error
        console.log(err);
        res.status(500).send({ message: "Internal Server Error" });
    }
}