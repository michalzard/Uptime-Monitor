import { NextFunction, Request, Response } from "express";
import { db } from "..";
import { findSessionByToken } from "../sql/authQuery";
import { GetObjectCommand, s3GetSignedUrl } from "../vendor/aws";

export async function getUserFromSession(req: Request, res: Response, next: NextFunction) {
    const sessions = await db.query(findSessionByToken, [res.locals.sessionID]);
    //session hold joined table with session/user/aws_img refs
    const session = sessions.rows[0];
    if (session) {
        if (session.avatar_url) {
            const getImage = new GetObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: session.aws_img_name,
            });
            // this has to load new url everytime so that access to the image is "fresh"
            const url = await s3GetSignedUrl(getImage);
            session.avatar_url = url;
        }

        res.locals.user = {
            ...session,
            service: session.service,
        }
        next();
    } else {
        res.status(401).send({ message: "User not found" });
    }
}