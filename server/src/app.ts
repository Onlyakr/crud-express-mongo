import cookieParser from "cookie-parser";
import cors from "cors";
import type { Application, Response } from "express";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { authMiddleware } from "./middlewares/auth.middleware.js";
import authRouter from "./modules/auth/auth.routes.js";
import itemsRouter from "./modules/items/items.routes.js";
import postsRouter from "./modules/posts/posts.routes.js";

// Initialize express server and store in app variable
const app: Application = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/v1/items", itemsRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1", authMiddleware, postsRouter);

// Health check endpoint
app.get("/", (_req, res: Response) => {
	res.json({ message: "Server is running" });
});

export default app;
