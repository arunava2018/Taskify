import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import webhookRoutes from "./routes/webhookRoutes";
import taskRoutes from "./routes/taskRoutes";
import { connectDB } from "./config/db";
import { clerkMiddleware, getAuth } from "@clerk/express";
dotenv.config();
const app = express();
console.log("CLERK_SECRET_KEY:", process.env.CLERK_SECRET_KEY ? "Loaded" : "Missing");
app.use(clerkMiddleware());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
connectDB();
app.use(express.json());
app.use("/api/webhooks", webhookRoutes);
app.use("/api/tasks", taskRoutes);
app.get("/api/test-auth", (req, res) => {
  const { userId } = getAuth(req);
  res.json({ userId });
});
app.use("/",(req,res)=>{
  res.send("Server is running")
})
app.listen(5000,()=>{
    console.log("Server is listening on port", 5000);
})
