'use server';

import { auth } from '@/lib/auth/auth';
import { prismaNeon } from '@/lib/prisma/prismaNeon';
import { revalidatePath } from 'next/cache';

const getSupplierId = async () => {
  const session = await auth();
  if (!session?.user?.email) throw new Error('Não autenticado');
  if (session.user.role !== 'SUPPLIER') throw new Error('Acesso negado');
  const user = await prismaNeon.user.findUnique({
    where: { email: session.user.email, status: 'ACTIVE' },
    select: { id: true }
  });
  if (!user) throw new Error('Usuário não encontrado');
  return user.id;
};

export const getDashboardStats = async () => {
  const supplierId = await getSupplierId();
  const [
    totalEquipment,
    activeRentals,
    pendingRentals,
    totalRevenue,
    monthRevenue
  ] = await Promise.all([
    prismaNeon.equipment.count({ where: { ownerId: supplierId } }),
    prismaNeon.rental.count({
      where: {
        equipment: { ownerId: supplierId },
        status: 'IN_PROGRESS'
      }
    }),
    prismaNeon.rental.count({
      where: {
        equipment: { ownerId: supplierId },
        status: 'PENDING'
      }
    }),
    prismaNeon.rental.aggregate({
      where: {
        equipment: { ownerId: supplierId },
        paymentStatus: 'PAID'
      },
      _sum: { total: true }
    }),
    prismaNeon.rental.aggregate({
      where: {
        equipment: { ownerId: supplierId },
        paymentStatus: 'PAID',
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      },
      _sum: { total: true }
    })
  ]);
  return {
    totalEquipment,
    activeRentals,
    pendingRentals,
    totalRevenue: Number(totalRevenue._sum.total ?? 0),
    monthRevenue: Number(monthRevenue._sum.total ?? 0)
  };
};

export const getRecentRentals = async () => {
  const supplierId = await getSupplierId();
  const rentals = await prismaNeon.rental.findMany({
    where: { equipment: { ownerId: supplierId } },
    include: {
      equipment: { select: { name: true, mainImageUrl: true } },
      user: { select: { name: true, email: true } }
    },
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  return rentals.map((rental) => ({
    id: rental.id,
    rentalNumber: rental.rentalNumber,
    status: rental.status,
    startDate: rental.startDate,
    endDate: rental.endDate,
    total: Number(rental.total),
    equipment: rental.equipment,
    user: rental.user,
    createdAt: rental.createdAt
  }));
};

export const getEquipmentPerformance = async () => {
  const supplierId = await getSupplierId();
  const equipment = await prismaNeon.equipment.findMany({
    where: { ownerId: supplierId },
    select: {
      id: true,
      name: true,
      mainImageUrl: true,
      _count: { select: { rentals: true } },
      rentals: {
        where: { paymentStatus: 'PAID' },
        select: { total: true }
      }
    },
    orderBy: { rentals: { _count: 'desc' } },
    take: 5
  });
  return equipment.map((eq) => ({
    id: eq.id,
    name: eq.name,
    mainImageUrl: eq.mainImageUrl,
    totalRentals: eq._count.rentals,
    totalRevenue: eq.rentals.reduce((sum, r) => sum + Number(r.total), 0)
  }));
};

export const getRevenueData = async () => {
  const supplierId = await getSupplierId();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const rentals = await prismaNeon.rental.findMany({
    where: {
      equipment: { ownerId: supplierId },
      paymentStatus: 'PAID',
      createdAt: { gte: sixMonthsAgo }
    },
    select: { createdAt: true, total: true }
  });
  const monthlyData = new Map<string, number>();
  rentals.forEach((rental) => {
    const month = new Date(rental.createdAt).toLocaleDateString('pt-BR', {
      month: 'short',
      year: 'numeric'
    });
    monthlyData.set(
      month,
      (monthlyData.get(month) ?? 0) + Number(rental.total)
    );
  });
  return Array.from(monthlyData.entries()).map(([month, revenue]) => ({
    month,
    revenue
  }));
};

export const updateRentalStatus = async (
  rentalId: string,
  status: 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
  reason?: string
) => {
  const supplierId = await getSupplierId();
  const rental = await prismaNeon.rental.findFirst({
    where: { id: rentalId, equipment: { ownerId: supplierId } }
  });
  if (!rental) throw new Error('Locação não encontrada');
  const updateData: Record<string, unknown> = { status };
  if (status === 'CONFIRMED') updateData.confirmedAt = new Date();
  if (status === 'IN_PROGRESS') updateData.startedAt = new Date();
  if (status === 'COMPLETED') updateData.completedAt = new Date();
  if (status === 'CANCELLED') {
    updateData.cancelledAt = new Date();
    updateData.cancelReason = reason;
  }
  await prismaNeon.rental.update({
    where: { id: rentalId },
    data: updateData
  });
  revalidatePath('/fornecedor');
  revalidatePath('/fornecedor/locacoes');
  return { success: true };
};
