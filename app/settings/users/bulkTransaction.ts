import { prisma } from '@/lib/prisma/prisma';
import { UserStatus } from '@prisma/client';

export const bulkUpdateUserStatus = async (
  userIds: string[],
  newStatus: UserStatus
) => {
  await prisma.user.updateMany({
    where: { id: { in: userIds } },
    data: { status: newStatus }
  });
};
