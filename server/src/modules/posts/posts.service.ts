import Posts from "./posts.model.js";
import type { CreatePostInput, UpdatePostInput } from "./posts.schema.js";

export const postsService = {
	getAllPosts: async (page: string, limit: string, title?: string) => {
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

		return { posts, total, pageNum, limitNum };
	},

	getPostById: async (id: string) => {
		return await Posts.findById(id);
	},

	createPost: async (data: CreatePostInput) => {
		return await Posts.create(data);
	},

	updatePost: async (id: string, data: UpdatePostInput) => {
		return await Posts.findByIdAndUpdate(id, data, {
			returnDocument: "after",
		});
	},

	deletePost: async (id: string) => {
		return await Posts.findByIdAndDelete(id);
	},
};
