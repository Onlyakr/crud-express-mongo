import type { Router } from "express";
import express from "express";
import postsController from "./posts.controller.js";

const router: Router = express.Router();

router.get("/", postsController.getAllPostsHandler);
router.get("/:id", postsController.getPostByIdHandler);
router.post("/", postsController.createPostHandler);
router.put("/:id", postsController.updatePostHandler);
router.delete("/:id", postsController.deletePostHandler);

export default router;
