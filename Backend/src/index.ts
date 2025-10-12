import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import webhookRoutes from "./routes/webhookRoutes";
import taskRoutes from "./routes/taskRoutes";
import todoRoutes from "./routes/todoRoutes"
import userRoutes from "./routes/userRoutes"
import { connectDB } from "./config/db";
import { clerkMiddleware, getAuth } from "@clerk/express";
dotenv.config();
const app = express();
app.use(clerkMiddleware());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
connectDB();
app.use("/api/webhooks", webhookRoutes);
app.use(express.json());
app.use("/api/tasks", taskRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/users", userRoutes);
app.use("/",(req,res)=>{
  res.send("Server is running")
})
// app.listen(5000,()=>{
//     console.log("Server is listening on port", 5000);
// })
