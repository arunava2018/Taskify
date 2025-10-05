import express from "express";
import { findUserById } from "../controllers/userController";
const router = express.Router();
router.get("/:userId",findUserById);
export default router;