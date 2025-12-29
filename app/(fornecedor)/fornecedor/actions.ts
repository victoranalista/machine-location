'use server';

import { prisma } from '@/lib/prisma/prisma';
import { auth } from '@/lib/auth/auth';
import { revalidatePath } from 'next/cache';

// Helper para verificar fornecedor
const requireSupplier = async () => {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');
  // if (session.user.role !== 'SUPPLIER') throw new Error('Forbidden');
  return { ...session.user, id: session.user.id as string };
};

// Dashboard Stats
export const getSupplierDashboardStats = async () => {
  const user = await requireSupplier();

  const [totalEquipment, activeRentals, pendingApproval, totalRevenue] =
    await Promise.all([
      prisma.equipment.count({ where: { ownerId: user.id } }),
      prisma.rental.count({
        where: {
          equipment: { ownerId: user.id },
          status: { in: ['CONFIRMED', 'IN_PROGRESS'] }
        }
      }),
      prisma.equipment.count({
        where: { ownerId: user.id, isApproved: false }
      }),
      prisma.rental.aggregate({
        where: {
          equipment: { ownerId: user.id },
          paymentStatus: 'PAID'
        },
        _sum: { total: true }
      })
    ]);

  return {
    totalEquipment,
    activeRentals,
    pendingApproval,
    totalRevenue: totalRevenue._sum.total?.toNumber() ?? 0
  };
};

// Equipment Management
export const getSupplierEquipment = async (page = 1, perPage = 10) => {
  const user = await requireSupplier();

  const [equipment, total] = await Promise.all([
    prisma.equipment.findMany({
      where: { ownerId: user.id },
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { createdAt: 'desc' },
      include: {
        category: { select: { name: true } },
        brand: { select: { name: true } },
        _count: { select: { rentals: true } }
      }
    }),
    prisma.equipment.count({ where: { ownerId: user.id } })
  ]);

  return { equipment, total, totalPages: Math.ceil(total / perPage) };
};

export const createSupplierEquipment = async (data: {
  name: string;
  description: string;
  categoryId: string;
  brandId?: string;
  model?: string;
  year?: number;
  dailyRate: number;
  weeklyRate?: number;
  monthlyRate?: number;
  city?: string;
  state?: string;
}) => {
  const user = await requireSupplier();
  const slug = data.name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');

  const equipment = await prisma.equipment.create({
    data: {
      name: data.name,
      description: data.description,
      categoryId: data.categoryId,
      slug,
      ownerId: user.id,
      dailyRate: data.dailyRate,
      weeklyRate: data.weeklyRate,
      monthlyRate: data.monthlyRate,
      brandId: data.brandId,
      model: data.model,
      year: data.year,
      city: data.city,
      state: data.state,
      isApproved: false, // Precisa aprovação do admin
      status: 'MAINTENANCE' // Fica em manutenção até ser aprovado
    }
  });

  revalidatePath('/fornecedor/equipamentos');
  return { success: true, equipment };
};

export const updateSupplierEquipment = async (
  id: string,
  data: {
    name?: string;
    description?: string;
    dailyRate?: number;
    weeklyRate?: number;
    monthlyRate?: number;
    status?: 'AVAILABLE' | 'RENTED' | 'MAINTENANCE' | 'UNAVAILABLE';
  }
) => {
  const user = await requireSupplier();

  // Verificar se o equipamento pertence ao usuário
  const equipment = await prisma.equipment.findFirst({
    where: { id, ownerId: user.id }
  });

  if (!equipment) {
    throw new Error('Equipamento não encontrado');
  }

  const updated = await prisma.equipment.update({
    where: { id },
    data
  });

  revalidatePath('/fornecedor/equipamentos');
  return { success: true, equipment: updated };
};

export const deleteSupplierEquipment = async (id: string) => {
  const user = await requireSupplier();

  // Verificar se o equipamento pertence ao usuário
  const equipment = await prisma.equipment.findFirst({
    where: { id, ownerId: user.id }
  });

  if (!equipment) {
    throw new Error('Equipamento não encontrado');
  }

  await prisma.equipment.delete({ where: { id } });

  revalidatePath('/fornecedor/equipamentos');
  return { success: true };
};

// Rentals
export const getSupplierRentals = async (page = 1, perPage = 10) => {
  const user = await requireSupplier();

  const [rentalsData, total] = await Promise.all([
    prisma.rental.findMany({
      where: {
        equipment: { ownerId: user.id }
      },
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        equipment: { select: { name: true, slug: true } }
      }
    }),
    prisma.rental.count({
      where: {
        equipment: { ownerId: user.id }
      }
    })
  ]);

  const rentals = rentalsData.map((rental) => ({
    ...rental,
    total: rental.total.toNumber(),
    dailyRate: rental.dailyRate.toNumber()
  }));

  return { rentals, total, totalPages: Math.ceil(total / perPage) };
};

// Categories & Brands (read-only for suppliers)
export const getCategories = async () => {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true }
  });
};

export const getBrands = async () => {
  return prisma.brand.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true }
  });
};
