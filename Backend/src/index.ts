import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import webhookRoutes from "./routes/webhookRoutes";
import { connectDB } from "./config/db";
dotenv.config();
const app = express();
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
connectDB();
app.use("/api/webhooks", webhookRoutes);
app.use(express.json());
app.use("/",(req,res)=>{
  res.send("Server is running")
})
app.listen(5000,()=>{
    console.log("Server is listening on port", 5000);
})
