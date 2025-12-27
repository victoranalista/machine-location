'use server';

import { prismaNeon } from '@/lib/prisma/prismaNeon';
import { EquipmentStatus } from '@/prisma/generated/prisma/client';

export type EquipmentDetail = {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string | null;
  mainImageUrl: string | null;
  dailyRate: number;
  weeklyRate: number | null;
  monthlyRate: number | null;
  minRentalDays: number;
  maxRentalDays: number | null;
  depositAmount: number | null;
  operatingWeight: number | null;
  enginePower: string | null;
  fuelType: string | null;
  capacity: string | null;
  dimensions: string | null;
  features: string[];
  model: string | null;
  year: number | null;
  city: string | null;
  state: string | null;
  status: EquipmentStatus;
  brand: { name: string; logoUrl: string | null } | null;
  category: { name: string; slug: string };
  images: { id: string; url: string; alt: string | null; isPrimary: boolean }[];
  specs: { id: string; name: string; value: string; unit: string | null }[];
  averageRating: number;
  reviewCount: number;
};

export const getEquipmentBySlug = async (
  slug: string
): Promise<EquipmentDetail | null> => {
  const equipment = await prismaNeon.equipment.findUnique({
    where: { slug },
    include: {
      brand: { select: { name: true, logoUrl: true } },
      category: { select: { name: true, slug: true } },
      images: { orderBy: { sortOrder: 'asc' } },
      specs: { orderBy: { sortOrder: 'asc' } },
      reviews: { select: { rating: true } }
    }
  });
  if (!equipment) return null;
  await prismaNeon.equipment.update({
    where: { slug },
    data: { viewCount: { increment: 1 } }
  });
  const totalRatings = equipment.reviews.reduce((sum, r) => sum + r.rating, 0);
  const averageRating =
    equipment.reviews.length > 0 ? totalRatings / equipment.reviews.length : 0;
  return {
    id: equipment.id,
    name: equipment.name,
    slug: equipment.slug,
    description: equipment.description,
    shortDescription: equipment.shortDescription,
    mainImageUrl: equipment.mainImageUrl,
    dailyRate: Number(equipment.dailyRate),
    weeklyRate: equipment.weeklyRate ? Number(equipment.weeklyRate) : null,
    monthlyRate: equipment.monthlyRate ? Number(equipment.monthlyRate) : null,
    minRentalDays: equipment.minRentalDays,
    maxRentalDays: equipment.maxRentalDays,
    depositAmount: equipment.depositAmount
      ? Number(equipment.depositAmount)
      : null,
    operatingWeight: equipment.operatingWeight
      ? Number(equipment.operatingWeight)
      : null,
    enginePower: equipment.enginePower,
    fuelType: equipment.fuelType,
    capacity: equipment.capacity,
    dimensions: equipment.dimensions,
    features: equipment.features,
    model: equipment.model,
    year: equipment.year,
    city: equipment.city,
    state: equipment.state,
    status: equipment.status,
    brand: equipment.brand,
    category: equipment.category,
    images: equipment.images.map((img) => ({
      id: img.id,
      url: img.url,
      alt: img.alt,
      isPrimary: img.isPrimary
    })),
    specs: equipment.specs.map((spec) => ({
      id: spec.id,
      name: spec.name,
      value: spec.value,
      unit: spec.unit
    })),
    averageRating,
    reviewCount: equipment.reviews.length
  };
};

export const getRelatedEquipment = async (
  categorySlug: string,
  excludeId: string,
  limit = 4
) => {
  const equipment = await prismaNeon.equipment.findMany({
    where: {
      category: { slug: categorySlug },
      id: { not: excludeId },
      status: EquipmentStatus.AVAILABLE
    },
    include: {
      brand: { select: { name: true } },
      category: { select: { name: true, slug: true } }
    },
    take: limit,
    orderBy: { viewCount: 'desc' }
  });
  return equipment.map((eq) => ({
    ...eq,
    dailyRate: Number(eq.dailyRate),
    weeklyRate: eq.weeklyRate ? Number(eq.weeklyRate) : null,
    monthlyRate: eq.monthlyRate ? Number(eq.monthlyRate) : null
  }));
};

export const checkEquipmentAvailability = async (
  equipmentId: string,
  startDate: Date,
  endDate: Date
) => {
  const equipment = await prismaNeon.equipment.findUnique({
    where: { id: equipmentId },
    select: { status: true, availableFrom: true, availableTo: true }
  });
  if (!equipment || equipment.status !== EquipmentStatus.AVAILABLE)
    return { available: false, reason: 'Equipamento indisponível' };
  if (equipment.availableFrom && startDate < equipment.availableFrom)
    return {
      available: false,
      reason: 'Data de início anterior à disponibilidade'
    };
  if (equipment.availableTo && endDate > equipment.availableTo)
    return {
      available: false,
      reason: 'Data de término posterior à disponibilidade'
    };
  const conflictingRentals = await prismaNeon.rental.count({
    where: {
      equipmentId,
      status: { in: ['CONFIRMED', 'IN_PROGRESS'] },
      OR: [{ startDate: { lte: endDate }, endDate: { gte: startDate } }]
    }
  });
  if (conflictingRentals > 0)
    return { available: false, reason: 'Período já reservado' };
  return { available: true, reason: null };
};
