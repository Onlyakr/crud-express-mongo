import z from "zod";

const registerSchema = z.object({
  name: z.string("Invalid name"),
  email: z.email("Invalid email address"),
  password: z
    .string("Invalid password")
    .min(8, "Password must be at least 8 characters long"),
});

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z
    .string("Invalid password")
    .min(8, "Password must be at least 8 characters long"),
});

export { registerSchema, loginSchema };
