import { model, Schema } from "mongoose";

const userSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			unique: true,
			required: true,
			trim: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user",
		},
		isEmailVerified: {
			type: Boolean,
			default: false,
		},
		isTwoFactorEnabled: {
			type: Boolean,
			default: false,
		},
		twoFactorSecret: {
			type: String,
			default: null,
		},
		tokenVersion: {
			type: Number,
			default: 0,
		},
		resetPasswordToken: {
			type: String,
			default: null,
		},
		resetPasswordExpires: {
			type: Date,
			default: null,
		},
	},
	{
		timestamps: true,
	},
);

const Users = model("Users", userSchema);

export default Users;
