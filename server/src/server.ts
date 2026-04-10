import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import connectToDB from "./config/db.js";
import itemsRouter from "./modules/items/items.routes.js";
import postsRouter from "./modules/posts/posts.routes.js";
import authRouter from "./modules/auth/auth.routes.js";
import dotenv from "dotenv";

import { authMiddleware } from "./middlewares/auth.js";

import type { Response } from "express";

dotenv.config();

// Create PORT variable to store the port from env
const PORT = process.env.PORT || 8000;

// Initialize express server and store in app variable
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/items", itemsRouter);
app.use("/posts", authMiddleware, postsRouter);
app.use("/auth", authMiddleware, authRouter);

// Health check endpoint
app.get("/", (_, res: Response) => {
  res.json({ message: "Server is running" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectToDB();
});
