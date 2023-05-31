import { Request, Response, NextFunction } from "express";
import { readCookiesFromHeaders } from "../utils/cookies";

export function verifySessionCookie(req: Request, res: Response, next: NextFunction) {
    const cookies = readCookiesFromHeaders(req);
    if (!cookies?.sessionID) return res.status(401).send({ message: "Unauthorized" });
    else {
        res.locals.sessionID = cookies.sessionID;
        next();
    }

} 