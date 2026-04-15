import type { Router } from "express";
import express from "express";
import postsController from "./posts.controller.js";

const router: Router = express.Router();

router.get("/posts", postsController.getAllPostsHandler);
router.get("/posts/:id", postsController.getPostByIdHandler);
router.post("/posts", postsController.createPostHandler);
router.put("/posts/:id", postsController.updatePostHandler);
router.delete("/posts/:id", postsController.deletePostHandler);

export default router;
