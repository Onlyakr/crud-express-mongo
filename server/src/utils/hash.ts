import bcrypt from "bcryptjs";

export async function hashPassword(password: string) {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new Error(
      `Failed to hash password: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export async function comparePassword(
  password: string,
  hashedPassword: string,
) {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    throw new Error(
      `Failed to compare password: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
