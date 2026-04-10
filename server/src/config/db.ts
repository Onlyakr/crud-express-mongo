import mongoose from "mongoose";

export default async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log("Connected to MongoDB");
  } catch (error) {
    const e = error as Error;
    console.error("Connection error: ", e.message);
    process.exit(1);
  }
}
