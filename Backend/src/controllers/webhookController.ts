import { Request, Response } from "express";
import { Webhook } from "svix";
import User from "../models/User";
interface ClerkWebhookEvent {
  id: string;
  type: string;
  data: any;
}

// helper to safely read headers (svix uses lowercase names in Node)
const getSvixHeaders = (req: Request) => ({
  "svix-id": req.header("svix-id") ?? "",
  "svix-timestamp": req.header("svix-timestamp") ?? "",
  "svix-signature": req.header("svix-signature") ?? "",
});

export const clerkWebhookHandler = async (req: Request, res: Response) => {
  const rawBody = req.body as Buffer;
  const signingSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  if (!signingSecret) {
    console.error("Missing CLERK_WEBHOOK_SIGNING_SECRET");
    return res.status(500).send("Server misconfiguration");
  }

  try {
    const wh = new Webhook(signingSecret);

    // Cast the result so TS knows it's our event type
    const evt = wh.verify(rawBody, getSvixHeaders(req)) as ClerkWebhookEvent;

    const eventType = evt.type;
    const payload = evt.data;

    if (eventType === "user.created" || eventType === "user.updated") {
      const clerkId = payload.id;
      const name =
        `${payload.first_name || ""} ${payload.last_name || ""}`.trim() ||
        payload.user_name ||
        (payload.email_addresses?.[0]?.email_address ?? "Unknown");

      await User.findOneAndUpdate(
        { user_id: clerkId },
        { user_name: name },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    } else if (eventType === "user.deleted") {
      await User.findOneAndDelete({ user_id: payload.id });
    } else {
      console.log("Unhandled Clerk event type:", eventType);
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook verification/processing error:", err);
    return res.status(400).json({ error: "invalid webhook" });
  }
};
