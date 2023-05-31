import express from "express";
import { verifySessionCookie } from "../middlewares/cookiesMiddleware";
import { getUserFromSession } from "../middlewares/authMiddleware";
import { handleGoogleDiskUpload } from "../controllers/uploadController";
const router = express.Router();
import multer from "multer";
const upload = multer();

router.post("/", verifySessionCookie, getUserFromSession, upload.single("pfp"), handleGoogleDiskUpload);

export default router;