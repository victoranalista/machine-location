import bcrypt from 'bcryptjs';

const getSaltRounds = (): number => {
  const rounds = process.env.BCRYPT_SALT_ROUNDS;
  return rounds ? parseInt(rounds, 10) : 10;
};

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(getSaltRounds());
  return await bcrypt.hash(password, salt);
};

const isAlreadyHashed = (password: string): boolean => {
  return password.startsWith('$2a$') || password.startsWith('$2b$');
};

export const verifyPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export const ensurePasswordHashed = async (
  password: string
): Promise<string> => {
  if (isAlreadyHashed(password)) return password;
  return await hashPassword(password);
};
