import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { getSocketConnection } from "./socket/socket.js";
import { errorHandler } from "./utils/ApiError.js";
import path from "path";

dotenv.config({ path: "./.env" });

const app = express();
const __dirname = path.resolve();
export const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST"],
  },
});

getSocketConnection();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes imports
import commentRoutes from "./routes/comment.routes.js";
import postRoutes from "./routes/post.routes.js";
import userRoutes from "./routes/user.routes.js";
import messageRoutes from "./routes/message.routes.js";

// routes declaration
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/comment", commentRoutes);
app.use("/api/v1/message", messageRoutes);

// Routes
app.get("/api/v1/healthcheck", (_, res) => {
  res.send({
    status: 200,
    message: "It's working...",
  });
});

app.use(errorHandler);

app.use(express.static(path.join(__dirname, "/frontend/dist")));
app.get("*", (_, res) => res.sendFile(path.join(__dirname, "frontend", "dist", "index.html")));
export default app;
