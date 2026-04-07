import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import env from "./config/env.js";
import postsRouter from "./modules/posts/posts.routes.js";
import mockData from "./utils/mock-data.js";

import { authMiddleware } from "./middlewares/auth.js";

import type { Request, Response } from "express";

// Create PORT variable from env
const PORT = env.PORT;

// Initial express server and store in app variable
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/posts", authMiddleware, postsRouter);

// Health check endpoint
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Server is running" });
});

// HTTP method ( GET, POST, PUT, PATCH and DELETE )
app.get("/items", (req: Request, res: Response) => {
  // Query parameter
  const { name } = req.query;

  if (!name) {
    res.json(mockData);
  }

  res.json(mockData.filter((item) => item.name.includes(name as string)));
});

// Route parameter
app.get("/items/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  res.json(mockData.find((item) => item.id === Number(id)));
});

app.post("/items", (req: Request, res: Response) => {
  const body = req.body;

  mockData.push(body);

  res.send(201).json({
    message: "Created",
    data: body,
  });
});

app.put("/items/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const body = req.body;

  const index = mockData.findIndex((item) => item.id === Number(id));
  if (index !== -1) {
    mockData[index] = { ...mockData[index], ...body };
    res.json({
      message: "Updated",
      data: mockData[index],
    });
  } else {
    res.send(404).json({
      message: "Not found",
    });
  }
});

app.patch("/items/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const body = req.body;

  const index = mockData.findIndex((item) => item.id === Number(id));
  if (index !== -1) {
    mockData[index] = { ...mockData[index], ...body };
    res.json({
      message: "Updated",
      data: mockData[index],
    });
  } else {
    res.send(404).json({
      message: "Not found",
    });
  }
});

app.delete("/items/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  const data = mockData.filter((data) => data.id !== Number(id));

  res.json({
    message: "Deleted",
    data,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
