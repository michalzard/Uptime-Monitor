import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsCommand } from "@aws-sdk/client-s3";
export { PutObjectCommand, GetObjectCommand, ListObjectsCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv";
dotenv.config();

const client = new S3Client({
    region: process.env.AWS_BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_SECRET_KEY as string,
    }
});

export async function s3GetFile(command: GetObjectCommand) {
    return client.send(command);
}
export function s3GetFileList(command: ListObjectsCommand) {
    return client.send(command);
}
export function s3UploadFile(command: PutObjectCommand) {
    return client.send(command);
}
export function s3DeleteFile(command: DeleteObjectCommand) {
    return client.send(command);
}


export function s3GetSignedUrl(command: GetObjectCommand, expiresIn: number = 7200) {
    return getSignedUrl(client, command, { expiresIn });
}


