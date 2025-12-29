'use server';

import { prisma } from '@/lib/prisma/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth/auth';

// Helper para verificar admin
const requireAdmin = async () => {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');
  // if (session.user.role !== 'ADMIN') throw new Error('Forbidden');
  return session.user;
};

// Dashboard Stats
export const getAdminDashboardStats = async () => {
  await requireAdmin();

  const [
    totalEquipment,
    availableEquipment,
    totalRentals,
    activeRentals,
    pendingRentals,
    totalUsers,
    totalRevenue
  ] = await Promise.all([
    prisma.equipment.count(),
    prisma.equipment.count({ where: { status: 'AVAILABLE' } }),
    prisma.rental.count(),
    prisma.rental.count({
      where: { status: { in: ['CONFIRMED', 'IN_PROGRESS'] } }
    }),
    prisma.rental.count({ where: { status: 'PENDING' } }),
    prisma.user.count(),
    prisma.rental.aggregate({
      _sum: { total: true },
      where: { paymentStatus: 'PAID' }
    })
  ]);

  return {
    totalEquipment,
    availableEquipment,
    totalRentals,
    activeRentals,
    pendingRentals,
    totalUsers,
    totalRevenue: totalRevenue._sum.total?.toNumber() ?? 0
  };
};

// Recent Rentals for Dashboard
export const getRecentRentals = async (limit = 5) => {
  await requireAdmin();

  return prisma.rental.findMany({
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } },
      equipment: { select: { name: true, slug: true } }
    }
  });
};

// Equipment Management
export const getAdminEquipmentList = async (
  page = 1,
  perPage = 10,
  search?: string,
  filter?: 'all' | 'pending' | 'approved'
) => {
  await requireAdmin();

  const where = {
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as const } },
            { model: { contains: search, mode: 'insensitive' as const } }
          ]
        }
      : {}),
    ...(filter === 'pending' ? { isApproved: false } : {}),
    ...(filter === 'approved' ? { isApproved: true } : {})
  };

  const [equipment, total] = await Promise.all([
    prisma.equipment.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { createdAt: 'desc' },
      include: {
        category: { select: { name: true } },
        brand: { select: { name: true } },
        owner: { select: { name: true, email: true } },
        _count: { select: { rentals: true } }
      }
    }),
    prisma.equipment.count({ where })
  ]);

  return { equipment, total, totalPages: Math.ceil(total / perPage) };
};

export const createEquipment = async (data: {
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  brandId?: string;
  model?: string;
  year?: number;
  dailyRate: number;
  weeklyRate?: number;
  monthlyRate?: number;
  minRentalDays?: number;
  locationId?: string;
  ownerId: string;
}) => {
  await requireAdmin();

  const equipment = await prisma.equipment.create({
    data: {
      ...data,
      dailyRate: data.dailyRate,
      weeklyRate: data.weeklyRate,
      monthlyRate: data.monthlyRate,
      ownerId: data.ownerId
    }
  });

  revalidatePath('/admin/equipamentos');
  return { success: true, equipment };
};

export const updateEquipment = async (
  id: string,
  data: {
    name?: string;
    description?: string;
    dailyRate?: number;
    weeklyRate?: number;
    monthlyRate?: number;
    status?: 'AVAILABLE' | 'RENTED' | 'MAINTENANCE' | 'UNAVAILABLE';
    isApproved?: boolean;
  }
) => {
  await requireAdmin();

  const equipment = await prisma.equipment.update({
    where: { id },
    data
  });

  revalidatePath('/admin/equipamentos');
  revalidatePath(`/equipamentos/${equipment.slug}`);
  return { success: true, equipment };
};

export const approveEquipment = async (id: string) => {
  await requireAdmin();

  const equipment = await prisma.equipment.update({
    where: { id },
    data: {
      isApproved: true,
      status: 'AVAILABLE'
    }
  });

  revalidatePath('/admin/equipamentos');
  revalidatePath(`/equipamentos/${equipment.slug}`);
  return { success: true };
};

export const rejectEquipment = async (id: string) => {
  await requireAdmin();

  const equipment = await prisma.equipment.update({
    where: { id },
    data: {
      isApproved: false,
      status: 'UNAVAILABLE'
    }
  });

  revalidatePath('/admin/equipamentos');
  return { success: true };
};

export const deleteEquipment = async (id: string) => {
  await requireAdmin();

  await prisma.equipment.delete({ where: { id } });

  revalidatePath('/admin/equipamentos');
  return { success: true };
};

// Category Management
export const getAdminCategories = async () => {
  await requireAdmin();

  return prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { equipment: true } } }
  });
};

export const createCategory = async (data: {
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}) => {
  await requireAdmin();

  const category = await prisma.category.create({ data });

  revalidatePath('/admin/categorias');
  revalidatePath('/');
  return { success: true, category };
};

export const updateCategory = async (
  id: string,
  data: { name?: string; description?: string; imageUrl?: string }
) => {
  await requireAdmin();

  const category = await prisma.category.update({ where: { id }, data });

  revalidatePath('/admin/categorias');
  revalidatePath('/');
  return { success: true, category };
};

export const deleteCategory = async (id: string) => {
  await requireAdmin();

  await prisma.category.delete({ where: { id } });

  revalidatePath('/admin/categorias');
  return { success: true };
};

// Rental Management
export const getAdminRentals = async (
  page = 1,
  perPage = 10,
  status?: string
) => {
  await requireAdmin();

  const where =
    status && status !== 'all'
      ? {
          status: status as
            | 'PENDING'
            | 'CONFIRMED'
            | 'IN_PROGRESS'
            | 'COMPLETED'
            | 'CANCELLED'
        }
      : {};

  const [rentals, total] = await Promise.all([
    prisma.rental.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        equipment: { select: { name: true, slug: true, mainImageUrl: true } }
      }
    }),
    prisma.rental.count({ where })
  ]);

  return { rentals, total, totalPages: Math.ceil(total / perPage) };
};

export const updateRentalStatus = async (
  id: string,
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
) => {
  await requireAdmin();

  const rental = await prisma.rental.update({
    where: { id },
    data: { status }
  });

  revalidatePath('/admin/locacoes');
  return { success: true, rental };
};

export const updatePaymentStatus = async (
  id: string,
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
) => {
  await requireAdmin();

  const rental = await prisma.rental.update({
    where: { id },
    data: { paymentStatus }
  });

  revalidatePath('/admin/locacoes');
  return { success: true, rental };
};

// User Management
export const getAdminUsers = async (
  page = 1,
  perPage = 10,
  search?: string
) => {
  await requireAdmin();

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } }
        ]
      }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { rentals: true } } }
    }),
    prisma.user.count({ where })
  ]);

  return { users, total, totalPages: Math.ceil(total / perPage) };
};

// Brands Management
export const getAdminBrands = async () => {
  await requireAdmin();

  return prisma.brand.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { equipment: true } } }
  });
};

export const createBrand = async (data: {
  name: string;
  slug: string;
  logoUrl?: string;
}) => {
  await requireAdmin();

  const brand = await prisma.brand.create({ data });

  revalidatePath('/admin/equipamentos');
  return { success: true, brand };
};
