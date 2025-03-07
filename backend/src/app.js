import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { errorHandler } from "./utils/ApiError.js";

dotenv.config({ path: "./.env" });

const app = express();

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
import userRoutes from "./routes/user.routes.js";

// routes declaration
app.use("/api/v1/user", userRoutes);

// Routes
app.get("/api/v1/healthcheck", (_, res) => {
  res.send({
    status: 200,
    message: "It's working...",
  });
});

app.use(errorHandler);
export default app;
