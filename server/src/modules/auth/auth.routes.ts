import type { Router } from "express";
import express from "express";
import authController from "./auth.controller.js";

const router: Router = express.Router();

router.post("/register", authController.registerHandler);

router.get("/verify-email", authController.verifyEmailHandler);

router.post("/login", authController.loginHandler);

router.post("/refresh", authController.refreshHandler);

router.post("/logout", authController.logoutHandler);

export default router;
