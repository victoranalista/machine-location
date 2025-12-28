import { defineConfig, env } from 'prisma/config';
import fs from 'fs';

try {
  if (fs.existsSync('.env')) {
    process.loadEnvFile();
  } else {
    process.loadEnvFile();
  }
} catch (error) {
  if (error instanceof Error) {
    throw error;
  }
}

export default defineConfig({
  schema: 'prisma/schema.prisma',

  datasource: {
    url: env('POSTGRES_PRISMA_URL')
  },

  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts'
  }
});
