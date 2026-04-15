import type { Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import z from "zod";
import type { CustomRequest } from "../../middlewares/auth.middleware.js";
import { createPostSchema, updatePostSchema } from "./posts.schema.js";
import { postsService } from "./posts.service.js";

const postsController = {
  getAllPostsHandler: async (req: Request, res: Response) => {
    try {
      const {
        title,
        page = "1",
        limit = "10",
      } = req.query as {
        title?: string;
        page: string;
        limit: string;
      };

      const { posts, total, pageNum, limitNum } =
        await postsService.getAllPosts(page, limit, title);

      return res.json({
        message: "Get all posts successfully",
        data: posts,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } catch (error) {
      const e = error as Error;
      console.error("Error getting all posts:", e.message);
      res.json({ message: "Internal server error" });
    }
  },

  getPostByIdHandler: async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string;

      if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid post ID format" });
      }

      const post = await postsService.getPostById(id);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      return res.json({
        message: "Get post by id successfully",
        data: post,
      });
    } catch (error) {
      const e = error as Error;
      console.error("Error getting post by id:", e.message);
      res.json({ message: "Internal server error" });
    }
  },

  createPostHandler: async (req: CustomRequest, res: Response) => {
    try {
      const userId = req.userId;
      const isBodyValid = createPostSchema.safeParse({
        ...req.body,
        author: userId,
      });

      if (!isBodyValid.success) {
        const error = z.treeifyError(isBodyValid.error);
        return res.status(400).json({ message: "Invalid post data", error });
      }

      const newPost = await postsService.createPost(isBodyValid.data);

      return res.json({
        message: "Create post successfully",
        data: newPost,
      });
    } catch (error) {
      const e = error as Error;
      console.error("Error creating post:", e.message);
      res.json({ message: "Internal server error" });
    }
  },

  updatePostHandler: async (req: CustomRequest, res: Response) => {
    try {
      const id = req.params.id as string;
      const userId = req.userId;

      if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid post ID format" });
      }

      const existingPost = await postsService.getPostById(id);

      if (!existingPost) {
        return res.status(404).json({ message: "Post not found" });
      }

      if (existingPost.author.toString() !== userId) {
        return res
          .status(403)
          .json({ message: "Not authorized to update this post" });
      }

      const isBodyValid = updatePostSchema.safeParse(req.body);

      if (!isBodyValid.success) {
        const error = z.treeifyError(isBodyValid.error);
        return res.status(400).json({ message: "Invalid post data", error });
      }

      const updatedPost = await postsService.updatePost(id, isBodyValid.data);

      return res.json({
        message: "Update post successfully",
        data: updatedPost,
      });
    } catch (error) {
      const e = error as Error;
      console.error("Error updating post:", e.message);
      res.json({ message: "Internal server error" });
    }
  },

  deletePostHandler: async (req: CustomRequest, res: Response) => {
    try {
      const id = req.params.id as string;
      const userId = req.userId;

      if (!isValidObjectId(id)) {
        return res.status(400).json({ message: "Invalid post ID format" });
      }

      const existingPost = await postsService.getPostById(id);

      if (!existingPost) {
        return res.status(404).json({ message: "Post not found" });
      }

      if (existingPost.author.toString() !== userId) {
        return res
          .status(403)
          .json({ message: "Not authorized to delete this post" });
      }

      const deletedPost = await postsService.deletePost(id);

      return res.json({
        message: "Delete post successfully",
        data: deletedPost,
      });
    } catch (error) {
      const e = error as Error;
      console.error("Error deleting post:", e.message);
      res.json({ message: "Internal server error" });
    }
  },
};

export default postsController;
