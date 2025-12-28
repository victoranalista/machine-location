'use server';

import { prisma } from '@/lib/prisma/prisma';

export const getCategories = async () => {
  return prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' }
  });
};

export const getBrands = async () => {
  return prisma.brand.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' }
  });
};

export const getLocations = async () => {
  return prisma.location.findMany({
    select: { id: true, city: true, state: true },
    orderBy: { city: 'asc' }
  });
};
