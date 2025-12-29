import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';

declare global {
  var prisma: PrismaClient | undefined;
}

const getPrisma = () => {
  const connectionString = process.env.POSTGRES_PRISMA_URL!;

  const adapter = new PrismaNeon({ connectionString });

  const prisma = new PrismaClient({ adapter });

  if (process.env.NODE_ENV === 'development') global.prisma = prisma;
  return prisma;
};

export const prisma = global.prisma || getPrisma();
