import { prisma as basePrisma } from './prisma';

type ExtendedPrismaClient = typeof basePrisma & {
  project: {
    create: (args: { data: Record<string, unknown> }) => Promise<unknown>;
    update: (args: {
      where: { id: number };
      data: Record<string, unknown>;
    }) => Promise<unknown>;
    delete: (args: { where: { id: number } }) => Promise<unknown>;
    findMany: (args?: Record<string, unknown>) => Promise<unknown[]>;
    findUnique: (args: {
      where: { id: number };
      include?: Record<string, unknown>;
    }) => Promise<unknown | null>;
  };
  task: {
    create: (args: { data: Record<string, unknown> }) => Promise<unknown>;
    update: (args: {
      where: { id: number };
      data: Record<string, unknown>;
    }) => Promise<unknown>;
    delete: (args: { where: { id: number } }) => Promise<unknown>;
    findMany: (args?: Record<string, unknown>) => Promise<unknown[]>;
    findUnique: (args: {
      where: { id: number };
      include?: Record<string, unknown>;
    }) => Promise<unknown | null>;
    findFirst: (args?: Record<string, unknown>) => Promise<unknown | null>;
    count: (args?: Record<string, unknown>) => Promise<number>;
  };
  lineItem: {
    create: (args: { data: Record<string, unknown> }) => Promise<unknown>;
    update: (args: {
      where: { id: number };
      data: Record<string, unknown>;
    }) => Promise<unknown>;
    delete: (args: { where: { id: number } }) => Promise<unknown>;
    findMany: (args?: Record<string, unknown>) => Promise<unknown[]>;
  };
  fieldLog: {
    create: (args: { data: Record<string, unknown> }) => Promise<unknown>;
    findMany: (args?: Record<string, unknown>) => Promise<unknown[]>;
    count: (args?: Record<string, unknown>) => Promise<number>;
  };
  inventoryItem: {
    create: (args: { data: Record<string, unknown> }) => Promise<unknown>;
    update: (args: {
      where: { id: number };
      data: Record<string, unknown>;
    }) => Promise<unknown>;
    delete: (args: { where: { id: number } }) => Promise<unknown>;
    findMany: (args?: Record<string, unknown>) => Promise<unknown[]>;
    findUnique: (args: {
      where: { id: number };
      include?: Record<string, unknown>;
    }) => Promise<unknown | null>;
  };
  inventoryMovement: {
    create: (args: { data: Record<string, unknown> }) => Promise<unknown>;
    findMany: (args?: Record<string, unknown>) => Promise<unknown[]>;
  };
  aIInsight: {
    create: (args: { data: Record<string, unknown> }) => Promise<unknown>;
    findMany: (args?: Record<string, unknown>) => Promise<unknown[]>;
  };
  taskTemplate: {
    create: (args: { data: Record<string, unknown> }) => Promise<unknown>;
    update: (args: {
      where: { id: number };
      data: Record<string, unknown>;
    }) => Promise<unknown>;
    delete: (args: { where: { id: number } }) => Promise<unknown>;
    findMany: (args?: Record<string, unknown>) => Promise<unknown[]>;
    findUnique: (args: {
      where: { id: number };
      include?: Record<string, unknown>;
    }) => Promise<unknown | null>;
  };
  registrationItem: {
    create: (args: { data: Record<string, unknown> }) => Promise<unknown>;
    update: (args: {
      where: { id: number };
      data: Record<string, unknown>;
    }) => Promise<unknown>;
    delete: (args: { where: { id: number } }) => Promise<unknown>;
    findMany: (args?: Record<string, unknown>) => Promise<unknown[]>;
    count: (args?: Record<string, unknown>) => Promise<number>;
  };
  taskItemCompletion: {
    create: (args: { data: Record<string, unknown> }) => Promise<unknown>;
    delete: (args: { where: Record<string, unknown> }) => Promise<unknown>;
    findMany: (args?: Record<string, unknown>) => Promise<unknown[]>;
    findUnique: (args: {
      where: Record<string, unknown>;
    }) => Promise<unknown | null>;
  };
  stockConsumption: {
    create: (args: { data: Record<string, unknown> }) => Promise<unknown>;
    findMany: (args?: Record<string, unknown>) => Promise<unknown[]>;
  };
};

export const db = basePrisma as unknown as ExtendedPrismaClient;
