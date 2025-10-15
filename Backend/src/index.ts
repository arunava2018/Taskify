import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import webhookRoutes from "./routes/webhookRoutes";
import taskRoutes from "./routes/taskRoutes";
import todoRoutes from "./routes/todoRoutes";
import userRoutes from "./routes/userRoutes";
import { connectDB } from "./config/db";
import { clerkMiddleware } from "@clerk/express";

dotenv.config();

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

connectDB();

app.use(clerkMiddleware());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/webhooks", webhookRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/todos", todoRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Server and WebSocket are running");
});

io.on("connection", (socket) => {
  // console.log("User connected:", socket.id);

  socket.on("join_task", (taskId: string) => {
    socket.join(taskId);
    // console.log(`User ${socket.id} joined room: ${taskId}`);
  });

  socket.on("leave_task", (taskId: string) => {
    socket.leave(taskId);
    console.log(`User ${socket.id} left room: ${taskId}`);
  });

  socket.on("disconnect", () => {
    // console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server + Socket running on port ${PORT}`);
});

export { io };
export default app;
