import express from "express";
import { clerkWebhookHandler } from "../controllers/webhookController";
const router = express.Router();
// Clerk webhook endpoint
router.post(
  "/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhookHandler
);
export default router;
