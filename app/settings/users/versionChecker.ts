import { Prisma } from '@prisma/client';

// This file is deprecated - the user versioning system has been removed
// Keeping as stub for backwards compatibility

export interface UserVersionCheckResult {
  id: string;
  version: number;
  userId: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

const checker = async (
  prisma: Prisma.TransactionClient,
  userId: string
): Promise<UserVersionCheckResult | false> => {
  // Versioning system removed - this is now a no-op stub
  return false;
};

export default checker;
