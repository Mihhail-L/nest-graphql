import * as bcrypt from 'bcrypt';

/**
 * Creates a password hash for a user
 * @param password
 * @returns Promise<string>
 */
const createUserPasswordHash = async (password: string): Promise<string> => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  return await bcrypt.hash(password, salt);
};

/**
 * Validates a user's password
 * @param password
 * @param passwordHash
 * @returns Promise<boolean>
 */
const comparePassword = async (
  password: string,
  passwordHash: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, passwordHash);
};

export { createUserPasswordHash, comparePassword };
