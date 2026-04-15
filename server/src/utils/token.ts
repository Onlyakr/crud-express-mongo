import jwt from "jsonwebtoken";
import env from "../config/env.js";

export async function createAccessToken(
	userId: string,
	role: "user" | "admin",
	tokenVersion: number,
) {
	const payload = {
		sub: userId,
		role,
		tokenVersion,
	};
	return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
		expiresIn: "30m",
	});
}

export async function createRefreshToken(userId: string, tokenVersion: number) {
	const payload = {
		sub: userId,
		tokenVersion,
	};
	return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
		expiresIn: "7d",
	});
}

export async function verifyAccessToken(token: string) {
	return jwt.verify(token, env.JWT_ACCESS_SECRET) as {
		sub: string;
		role: string;
		tokenVersion: number;
	};
}

export async function verifyRefreshToken(token: string) {
	return jwt.verify(token, env.JWT_REFRESH_SECRET) as {
		sub: string;
		tokenVersion: number;
	};
}
