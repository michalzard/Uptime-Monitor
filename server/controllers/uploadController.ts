import axios from "axios";
import { Request, Response } from "express";
import { Readable } from "stream";
import path from "path";
import fs from "fs";
import { GoogleAuth } from "google-auth-library"; //FIXME: uninstall
import { google } from "googleapis";

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];



export async function handleGoogleDiskUpload(req: Request, res: Response) {
    // const { user } = res.locals;
    const file = req.file;
    try {
        if (file) {
            // handle s3 upload
        } else {
            res.status(400).send({ message: "You have to upload file" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Server Internal Error" });
    }

}
