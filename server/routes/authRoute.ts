import express from "express";
import { userLogin, userLogout, userRegistration, userSession, userUpdateInfo, userUpdatePassword } from "../controllers/authController";
import { userGithubAccess, userGoogleAccess, userGoogleRequestLink } from "../controllers/oauthController";
import { verifySessionCookie } from "../middlewares/cookiesMiddleware";
import { getUserFromSession } from "../middlewares/authMiddleware";
const router = express.Router();

// POST register
// POST login
// GET logout
// GET session
// POST forgot-password
// GET token-expiration via token
// GET password-reset
// POST account deactivation

router.post("/register", userRegistration);
router.post("/login", userLogin);
router.post("/logout", verifySessionCookie, userLogout);
router.get("/session", verifySessionCookie, getUserFromSession, userSession);
//TODO: router.post("/pw-forgot",)
//TODO: router.post("/pw-reset",)
//TODO: router.delete("/deactivation",)
router.post("/update", verifySessionCookie, getUserFromSession, userUpdateInfo);
router.post("/update-password", verifySessionCookie, getUserFromSession, userUpdatePassword);
// oAuth
router.post("/github", userGithubAccess);
router.get("/google/url", userGoogleRequestLink);
router.post("/google/access", userGoogleAccess);

export default router;