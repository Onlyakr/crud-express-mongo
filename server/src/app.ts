import cookieParser from "cookie-parser";
import cors from "cors";
import type { Application, Response } from "express";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { authMiddleware } from "./middlewares/auth.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import authRouter from "./modules/auth/auth.routes.js";
import itemsRouter from "./modules/items/items.routes.js";
import postsRouter from "./modules/posts/posts.routes.js";

const app: Application = express();

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  }),
);

// Logging
app.use(morgan("dev"));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/v1/items", itemsRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/posts", authMiddleware, postsRouter);

// Health check
app.get("/", (_req, res: Response) => {
  res.json({
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Error handler
app.use(errorHandler);

export default app;
