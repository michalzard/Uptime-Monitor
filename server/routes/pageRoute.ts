import express, { Request, Response } from "express";
import { createPage, getAllPages } from "../controllers/pageController";
import { verifySessionCookie } from "../middlewares/cookiesMiddleware";
const router = express.Router();

/**
 * POST create new page
 * GET return public pages / private pages if user is authorized
 * DELETE remove page 
 */
router.post("/create", verifySessionCookie, createPage);
router.get("/all", verifySessionCookie, getAllPages);
router.get("/:id", /**add getter controller */);
router.delete("/:id",/**add delete controller  */);

export default router;