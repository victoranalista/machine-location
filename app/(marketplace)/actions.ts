'use server';

import { prismaNeon } from '@/lib/prisma/prismaNeon';
import { EquipmentStatus } from '@/prisma/generated/prisma/client';

export type CategoryWithCount = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  imageUrl: string | null;
  equipmentCount: number;
};

export type EquipmentCard = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  mainImageUrl: string | null;
  dailyRate: number;
  weeklyRate: number | null;
  monthlyRate: number | null;
  city: string | null;
  state: string | null;
  brand: { name: string } | null;
  category: { name: string; slug: string };
  status: EquipmentStatus;
  featured: boolean;
};

export type EquipmentFilters = {
  categorySlug?: string;
  brandSlug?: string;
  city?: string;
  state?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'popular';
};

const buildWhereClause = (filters: EquipmentFilters) => {
  const where: Record<string, unknown> = { status: EquipmentStatus.AVAILABLE };
  if (filters.categorySlug) where.category = { slug: filters.categorySlug };
  if (filters.brandSlug) where.brand = { slug: filters.brandSlug };
  if (filters.city)
    where.city = { contains: filters.city, mode: 'insensitive' };
  if (filters.state) where.state = filters.state;
  if (filters.minPrice || filters.maxPrice) {
    where.dailyRate = {};
    if (filters.minPrice)
      (where.dailyRate as Record<string, number>).gte = filters.minPrice;
    if (filters.maxPrice)
      (where.dailyRate as Record<string, number>).lte = filters.maxPrice;
  }
  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
      { model: { contains: filters.search, mode: 'insensitive' } }
    ];
  }
  return where;
};

const buildOrderBy = (sortBy?: string) => {
  switch (sortBy) {
    case 'price_asc':
      return { dailyRate: 'asc' as const };
    case 'price_desc':
      return { dailyRate: 'desc' as const };
    case 'popular':
      return { viewCount: 'desc' as const };
    default:
      return { createdAt: 'desc' as const };
  }
};

export const getCategories = async (): Promise<CategoryWithCount[]> => {
  const categories = await prismaNeon.category.findMany({
    where: { parentId: null },
    include: { _count: { select: { equipment: true } } },
    orderBy: { name: 'asc' }
  });
  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description,
    icon: cat.icon,
    imageUrl: cat.imageUrl,
    equipmentCount: cat._count.equipment
  }));
};

export const getFeaturedEquipment = async (
  limit = 8
): Promise<EquipmentCard[]> => {
  const equipment = await prismaNeon.equipment.findMany({
    where: { status: EquipmentStatus.AVAILABLE, featured: true },
    include: {
      brand: { select: { name: true } },
      category: { select: { name: true, slug: true } }
    },
    orderBy: { viewCount: 'desc' },
    take: limit
  });
  return equipment.map((eq) => ({
    ...eq,
    dailyRate: Number(eq.dailyRate),
    weeklyRate: eq.weeklyRate ? Number(eq.weeklyRate) : null,
    monthlyRate: eq.monthlyRate ? Number(eq.monthlyRate) : null
  }));
};

export const getEquipmentList = async (filters: EquipmentFilters) => {
  const page = filters.page ?? 1;
  const limit = filters.limit ?? 12;
  const skip = (page - 1) * limit;
  const where = buildWhereClause(filters);
  const orderBy = buildOrderBy(filters.sortBy);
  const [equipment, total] = await Promise.all([
    prismaNeon.equipment.findMany({
      where,
      include: {
        brand: { select: { name: true } },
        category: { select: { name: true, slug: true } }
      },
      orderBy,
      skip,
      take: limit
    }),
    prismaNeon.equipment.count({ where })
  ]);
  return {
    equipment: equipment.map((eq) => ({
      ...eq,
      dailyRate: Number(eq.dailyRate),
      weeklyRate: eq.weeklyRate ? Number(eq.weeklyRate) : null,
      monthlyRate: eq.monthlyRate ? Number(eq.monthlyRate) : null
    })),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
  };
};

export const getPopularLocations = async (limit = 6) => {
  const locations = await prismaNeon.location.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
    take: limit
  });
  return locations;
};

export const getBrands = async () => {
  const brands = await prismaNeon.brand.findMany({
    include: { _count: { select: { equipment: true } } },
    orderBy: { name: 'asc' }
  });
  return brands.map((b) => ({
    id: b.id,
    name: b.name,
    slug: b.slug,
    logoUrl: b.logoUrl,
    equipmentCount: b._count.equipment
  }));
};
