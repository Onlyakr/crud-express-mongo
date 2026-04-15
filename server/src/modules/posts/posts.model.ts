import { model, Schema } from "mongoose";

const postSchema = new Schema(
	{
		title: { type: String, required: true },
		content: { type: String, required: true },
		image: { type: String },
		author: { type: Schema.Types.ObjectId, ref: "User", required: true },
	},
	{
		timestamps: true,
	},
);

const Posts = model("Posts", postSchema);

export default Posts;
