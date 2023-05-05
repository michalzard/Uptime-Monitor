import express, { Request, Response } from "express";
import { createPage } from "../controllers/pageController";
const router = express.Router();

/**
 * POST create new page
 * GET return public pages / private pages if user is authorized
 * DELETE remove page 
 */
router.post("/create", createPage);
router.get("/:id", /**add getter controller */);
router.delete("/:id",/**add delete controller  */);

export default router;