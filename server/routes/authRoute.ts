import express from "express";
import { userLogin, userLogout, userRegistration, userSession } from "../controllers/authController";
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
router.get("/session", userSession);
router.post("/logout", userLogout);

export default router;