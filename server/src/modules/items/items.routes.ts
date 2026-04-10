import express from "express";
import mockData from "../../utils/mock-data.js";

import type { Request, Response, Router } from "express";

const router: Router = express.Router();

// HTTP method ( GET, POST, PUT, PATCH and DELETE )
router.get("", (req: Request, res: Response) => {
  // Query parameter
  const { name } = req.query;

  if (!name) {
    return res.json(mockData);
  }

  return res.json(
    mockData.filter((item) => item.name.includes(name as string)),
  );
});

// Route parameter
router.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  return res.json(mockData.find((item) => item.id === Number(id)));
});

router.post("", (req: Request, res: Response) => {
  const body = req.body;

  mockData.push(body);

  return res.status(201).json({
    message: "Created",
    data: body,
  });
});

router.put("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const body = req.body;

  const index = mockData.findIndex((item) => item.id === Number(id));
  if (index !== -1) {
    mockData[index] = { id: Number(id), ...body };
    return res.json({
      message: "Updated",
      data: mockData[index],
    });
  } else {
    return res.status(404).json({
      message: "Not found",
    });
  }
});

router.patch("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const body = req.body;

  const index = mockData.findIndex((item) => item.id === Number(id));
  if (index !== -1) {
    mockData[index] = { ...mockData[index], ...body };
    return res.json({
      message: "Updated",
      data: mockData[index],
    });
  } else {
    return res.status(404).json({
      message: "Not found",
    });
  }
});

router.delete("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  const data = mockData.filter((data) => data.id !== Number(id));

  return res.json({
    message: "Deleted",
    data,
  });
});

export default router;
