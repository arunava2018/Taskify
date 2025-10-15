import { io } from "socket.io-client";
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
export const socket = io(BASE_URL, {
  transports: ["websocket"],
  withCredentials: true,
});

socket.on("connect", () => {
  console.log("Connected to Socket.io server:", socket.id);
});

socket.on("disconnect", () => {
  console.log("Disconnected from Socket.io server");
});
