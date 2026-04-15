import z from "zod";

const envSchema = z.object({
	NODE_ENV: z.enum(["development", "production"]),
	LISTEN_PORT: z.coerce.number().default(8000),
	MONGO_URI: z.string(),
	JWT_ACCESS_SECRET: z.string(),
	JWT_REFRESH_SECRET: z.string(),
	APP_URL: z.string().default("http://localhost:8000"),
	SMTP_HOST: z.string(),
	SMTP_PORT: z.coerce.number(),
	SMTP_USER: z.string(),
	SMTP_PASS: z.string(),
	EMAIL_FROM: z.string(),
});

const isEnvValid = envSchema.safeParse(process.env);

if (!isEnvValid.success) {
	console.error("Invalid environment variables: ", isEnvValid.error);
	process.exit(1);
}

const env = isEnvValid.data;

export default env;
