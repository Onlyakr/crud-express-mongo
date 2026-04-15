import type { Request, Response } from "express";
import mongoose from "mongoose";
import z from "zod";
import type { CustomRequest } from "../../middlewares/auth.middleware.js";
import Posts from "./posts.model.js";
import { createPostSchema, updatePostSchema } from "./posts.schema.js";

function isValidObjectId(id: string): boolean {
	return mongoose.Types.ObjectId.isValid(id);
}

const postsController = {
	getAllPostsHandler: async (req: Request, res: Response) => {
		try {
			const { title, page = "1", limit = "10" } = req.query;

			const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
			const limitNum = Math.min(
				100,
				Math.max(1, parseInt(limit as string, 10) || 10),
			);
			const skip = (pageNum - 1) * limitNum;

			const whereClause = title
				? { title: { $regex: `^${title}$`, $options: "i" } }
				: {};

			const [posts, total] = await Promise.all([
				Posts.find(whereClause).skip(skip).limit(limitNum).lean(),
				Posts.countDocuments(whereClause),
			]);

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

			const post = await Posts.findById(id);

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
			const { userId } = req;
			const isBodyValid = createPostSchema.safeParse({
				...req.body,
				author: userId,
			});

			if (!isBodyValid.success) {
				const error = z.treeifyError(isBodyValid.error);
				return res.status(400).json({ message: "Invalid post data", error });
			}

			const newPost = await Posts.create(isBodyValid.data);

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
			const { userId } = req;

			if (!isValidObjectId(id)) {
				return res.status(400).json({ message: "Invalid post ID format" });
			}

			const post = await Posts.findById(id);

			if (!post) {
				return res.status(404).json({ message: "Post not found" });
			}

			if (post.author.toString() !== userId) {
				return res
					.status(403)
					.json({ message: "Not authorized to update this post" });
			}

			const isBodyValid = updatePostSchema.safeParse(req.body);

			if (!isBodyValid.success) {
				const error = z.treeifyError(isBodyValid.error);
				return res.status(400).json({ message: "Invalid post data", error });
			}

			const updatedPost = await Posts.findByIdAndUpdate(id, isBodyValid.data, {
				returnDocument: "after",
			});

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
			const { userId } = req;

			if (!isValidObjectId(id)) {
				return res.status(400).json({ message: "Invalid post ID format" });
			}

			const post = await Posts.findById(id);

			if (!post) {
				return res.status(404).json({ message: "Post not found" });
			}

			if (post.author.toString() !== userId) {
				return res
					.status(403)
					.json({ message: "Not authorized to delete this post" });
			}

			const deletedPost = await Posts.findByIdAndDelete(id);

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
