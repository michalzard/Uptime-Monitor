import { Request, Response } from "express";
import { createId } from "@paralleldrive/cuid2";
import sharp from "sharp";
import { db } from "..";
import { updateUserAvatarURLByPK } from "../sql/authQuery";
import { createAwsImageRef, updateExistingAwsImageRef } from "../sql/awsQuery";
import { GetObjectCommand, PutObjectCommand, s3GetSignedUrl, s3UploadFile } from "../vendor/aws";



export async function handlePfpUpload(req: Request, res: Response) {
    try {
        const file = req.file;
        if (file) {
            await sharp(file.buffer).resize({ width: 80, height: 80 }).webp({ effort: 6, quality: 20 }).toBuffer().then(data => {
                const fileName = `${createId()}.webp`;
                const uploadImageCmd = new PutObjectCommand({
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: fileName,
                    Body: data,
                });
                const getUploadedImageCmd = new GetObjectCommand({
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: fileName,
                });
                s3UploadFile(uploadImageCmd).then(async data => {
                    const url = await s3GetSignedUrl(getUploadedImageCmd);

                    if (url) {
                        db.query(updateUserAvatarURLByPK, [res.locals.user.pk, url]); //save url to db
                        // save reference for said image for future
                        db.query(updateExistingAwsImageRef, [res.locals.user.pk, fileName]).then(data => {
                            // if there wasnt column insert new one
                            if (data.rowCount === 0) db.query(createAwsImageRef, [res.locals.user.pk, fileName]);
                        });
                        res.status(200).send({ message: "Profile picture was uploaded", url });
                    } else {
                        res.status(404).send({ message: "There was error with pfp uploading" });
                    }
                }).catch(console.error);
            }).catch(console.error);

        } else {
            res.status(400).send({ message: "You have to upload file" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Server Internal Error" });
    }
}
