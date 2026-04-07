import zod from "zod";

const envSchema = zod.object({
  PORT: zod.coerce.number().default(8000),
});

const isEnvValid = envSchema.safeParse(process.env);

if (!isEnvValid.success) {
  process.exit(1);
}

const env = isEnvValid.data;

export default env;
