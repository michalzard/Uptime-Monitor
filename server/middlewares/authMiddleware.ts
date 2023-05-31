import { NextFunction, Request, Response } from "express";
import { db } from "..";
import { findSessionByToken, findUserByPrimaryKey } from "../sql/authQuery";

export async function getUserFromSession(req: Request, res: Response, next: NextFunction) {
    const sessions = await db.query(findSessionByToken, [res.locals.sessionID]);
    const session = sessions.rows[0];
    if (session) {
        const userPK = session.user_pk;
        const sessionUserByPK = await db.query(findUserByPrimaryKey, [userPK]);
        const foundUser = sessionUserByPK.rows[0];
        res.locals.user = {
            ...foundUser,
            service: session.service,
        }
        next();
    } else {
        res.status(404).send({ message: "User not found" });
    }
}