import jwt from "jsonwebtoken";

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
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "30m",
  });
}

export async function createRefreshToken(userId: string, tokenVersion: number) {
  const payload = {
    sub: userId,
    tokenVersion,
  };
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
}
