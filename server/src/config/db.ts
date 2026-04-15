import mongoose from "mongoose";
import env from "./env.js";

export default async function connectToDB() {
	try {
		await mongoose.connect(env.MONGO_URI);
		console.log("Connected to MongoDB");
	} catch (error) {
		const e = error as Error;
		console.error("Connection error: ", e.message);
		process.exit(1);
	}
}
