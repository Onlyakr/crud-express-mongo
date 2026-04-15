import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/token.js";

export interface CustomRequest extends Request {
	userId?: string;
	role?: string;
}

export async function authMiddleware(
	req: CustomRequest,
	res: Response,
	next: NextFunction,
) {
	try {
		const { accessToken } = req.cookies;

		if (!accessToken) {
			throw new Error("No access token provided");
		}

		const payload = await verifyAccessToken(accessToken);

		if (!payload) {
			throw new Error("Invalid access token");
		}

		req.userId = payload.sub;
		req.role = payload.role;
		next();
	} catch (error) {
		const e = error as Error;
		console.error("Auth middleware error:", e.message);
		res.status(401).json({ message: "Unauthorized", error: e.message });
	}
}
