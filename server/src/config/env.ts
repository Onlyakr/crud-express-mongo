import z from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]),
  PORT: z.coerce.number().default(8000),
  MONGO_URI: z.string(),
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
});

const isEnvValid = envSchema.safeParse(process.env);

if (!isEnvValid.success) {
  console.error("Invalid environment variables: ", isEnvValid.error);
  process.exit(1);
}

const env = isEnvValid.data;

export default env;
