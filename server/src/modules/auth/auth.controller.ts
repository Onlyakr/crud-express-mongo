import z from "zod";
import jwt from "jsonwebtoken";
import User from "../users/users.model.js";
import sendEmail from "../../utils/email.js";

import { registerSchema, loginSchema } from "./auth.schema.js";
import { hashPassword, comparePassword } from "../../utils/hash.js";
import { createAccessToken, createRefreshToken } from "../../utils/token.js";

import type { Request, Response } from "express";

const authController = {
  registerHandler: async (req: Request, res: Response) => {
    try {
      // Validate request body
      const isBodyValid = registerSchema.safeParse(req.body);

      if (!isBodyValid.success) {
        const error = z.treeifyError(isBodyValid.error);
        return res.status(400).json({
          message: "Invalid registration data",
          error,
        });
      }

      // Create user
      const { name, email, password } = isBodyValid.data;

      const normalizedEmail = email.toLowerCase().trim();

      const existingUser = await User.findOne({ email: normalizedEmail });

      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const hashedPassword = await hashPassword(password);

      const newUser = await User.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
      });

      // Email verification
      const verificationToken = jwt.sign(
        { sub: newUser.id },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" },
      );

      const verificationUrl = `${process.env.APP_URL}/auth/verify-email?token=${verificationToken}`;

      await sendEmail(
        newUser.email,
        "Verify your email",
        `<p>Click here to verify your email: <a href="${verificationUrl}">${verificationUrl}</a></p>`,
      );

      return res.status(201).json({
        message: "User registered successfully",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          isTwoFaEnabled: newUser.isTwoFactorEnabled,
          isEmailVerified: newUser.isEmailVerified,
        },
      });
    } catch (error) {
      const e = error as Error;
      console.error("Registration error:", e.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  verifyEmailHandler: async (req: Request, res: Response) => {
    try {
      // Extract the token from the query parameters
      const token = req.query.token as string;

      // Verify the token and extract the payload
      if (!token) {
        return res
          .status(400)
          .json({ message: "Verification token is required" });
      }

      const payload = jwt.verify(token, process.env.JWT_SECRET!);

      // Find the user by the payload's sub (user ID)
      const user = await User.findById(payload.sub);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.isEmailVerified) {
        return res.json({ message: "Email already verified" });
      }

      // Mark the user's email as verified and save
      user.isEmailVerified = true;
      await user.save();
      // await User.updateOne({ id: user.id }, { isEmailVerified: true });

      return res.send("Verify email successfully");
    } catch (error) {
      const e = error as Error;
      console.error("Verify email error:", e.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  loginHandler: async (req: Request, res: Response) => {
    try {
      // Validate the request body against the login schema
      const isBodyValid = loginSchema.safeParse(req.body);

      if (!isBodyValid.success) {
        const error = z.treeifyError(isBodyValid.error);
        return res.status(400).json({ message: "Invalid login data", error });
      }

      const { email, password } = isBodyValid.data;

      const normalizedEmail = email.toLowerCase().trim();

      // Find the user by email
      const user = await User.findOne({ email: normalizedEmail });

      if (!user) {
        return res.status(403).json({ message: "Invalid credentials" });
      }

      // Compare the password with the stored hash
      const isPasswordValid = await comparePassword(password, user.password);

      if (!isPasswordValid) {
        return res.status(403).json({ message: "Invalid credentials" });
      }

      // Check if the email is verified
      if (!user.isEmailVerified) {
        return res.status(403).json({ message: "Email not verified" });
      }

      // Generate access and refresh tokens
      const accessToken = await createAccessToken(
        user.id,
        user.role,
        user.tokenVersion,
      );

      const refreshToken = await createRefreshToken(user.id, user.tokenVersion);

      // Set refresh token in a secure cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({
        message: "Login successful",
        accessToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isTwoFaEnabled: user.isTwoFactorEnabled,
          isEmailVerified: user.isEmailVerified,
        },
      });
    } catch (error) {
      const e = error as Error;
      console.error("Login error:", e.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};

export default authController;
