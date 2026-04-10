import express from "express";
import authController from "./auth.controller.js";

import type { Request, Response, Router } from "express";

const router: Router = express.Router();

router.post("/register", (req: Request, res: Response) => {
  authController.registerHandler(req, res);
});

router.get("/verify-email", (req: Request, res: Response) => {
  authController.verifyEmailHandler(req, res);
});

router.post("/login", (req: Request, res: Response) => {
  authController.loginHandler(req, res);
});

export default router;
