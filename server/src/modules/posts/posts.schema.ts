import mongoose from "mongoose";
import z from "zod";

export const createPostSchema = z.object({
	title: z
		.string("Title is required")
		.min(1, "Title must be at least 1 character")
		.max(100, "Title must be at most 100 characters"),
	content: z
		.string("Content is required")
		.min(1, "Content must be at least 1 character"),
	image: z.string().nullable().default(null),
	author: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
		message: "Invalid user id format",
	}),
});

export const updatePostSchema = z.object({
	title: z.string().optional(),
	content: z.string().optional(),
	image: z.string().nullable().default(null),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
