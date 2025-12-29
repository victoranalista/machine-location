'use server';

import { auth } from '@/lib/auth/auth';
import { prismaNeon } from '@/lib/prisma/prismaNeon';
import { revalidatePath } from 'next/cache';
import { RentalStatus } from '@prisma/client';

const getUserId = async () => {
  const session = await auth();
  if (!session?.user?.email) throw new Error('Não autorizado');
  const user = await prismaNeon.userHistory.findFirst({
    where: { email: session.user.email, status: 'ACTIVE' },
    orderBy: { version: 'desc' },
    select: { id: true }
  });
  if (!user) throw new Error('Usuário não encontrado');
  return user.id;
};

export const getUserRentals = async (status?: RentalStatus) => {
  const userId = await getUserId();
  const rentals = await prismaNeon.rental.findMany({
    where: { userId, ...(status && { status }) },
    include: {
      equipment: {
        include: {
          brand: { select: { name: true } },
          category: { select: { name: true, slug: true } }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  return rentals.map((rental: (typeof rentals)[number]) => ({
    id: rental.id,
    rentalNumber: rental.rentalNumber,
    startDate: rental.startDate,
    endDate: rental.endDate,
    totalDays: rental.totalDays,
    total: Number(rental.total),
    status: rental.status,
    paymentStatus: rental.paymentStatus,
    createdAt: rental.createdAt,
    equipment: {
      id: rental.equipment.id,
      name: rental.equipment.name,
      slug: rental.equipment.slug,
      mainImageUrl: rental.equipment.mainImageUrl,
      brand: rental.equipment.brand,
      category: rental.equipment.category
    }
  }));
};

export const cancelRental = async (rentalId: string) => {
  const userId = await getUserId();
  const rental = await prismaNeon.rental.findUnique({
    where: { id: rentalId },
    select: { userId: true, status: true }
  });
  if (!rental || rental.userId !== userId)
    throw new Error('Locação não encontrada');
  if (!['PENDING', 'CONFIRMED'].includes(rental.status))
    throw new Error('Não é possível cancelar esta locação');
  await prismaNeon.rental.update({
    where: { id: rentalId },
    data: { status: RentalStatus.CANCELLED, cancelledAt: new Date() }
  });
  revalidatePath('/minha-conta/locacoes');
  return { success: true };
};

export const getUserFavorites = async () => {
  const userId = await getUserId();
  const favorites = await prismaNeon.favorite.findMany({
    where: { userId },
    include: {
      equipment: {
        include: {
          brand: { select: { name: true } },
          category: { select: { name: true, slug: true } }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
  return favorites.map((fav: (typeof favorites)[number]) => ({
    id: fav.id,
    equipment: {
      id: fav.equipment.id,
      name: fav.equipment.name,
      slug: fav.equipment.slug,
      shortDescription: fav.equipment.shortDescription,
      mainImageUrl: fav.equipment.mainImageUrl,
      dailyRate: Number(fav.equipment.dailyRate),
      weeklyRate: fav.equipment.weeklyRate
        ? Number(fav.equipment.weeklyRate)
        : null,
      monthlyRate: fav.equipment.monthlyRate
        ? Number(fav.equipment.monthlyRate)
        : null,
      city: fav.equipment.city,
      state: fav.equipment.state,
      status: fav.equipment.status,
      featured: fav.equipment.featured,
      brand: fav.equipment.brand,
      category: fav.equipment.category
    }
  }));
};

export const toggleFavorite = async (equipmentId: string) => {
  const userId = await getUserId();
  const existing = await prismaNeon.favorite.findUnique({
    where: { userId_equipmentId: { userId, equipmentId } }
  });
  if (existing) {
    await prismaNeon.favorite.delete({ where: { id: existing.id } });
    revalidatePath('/minha-conta/favoritos');
    return { favorited: false };
  }
  await prismaNeon.favorite.create({ data: { userId, equipmentId } });
  revalidatePath('/minha-conta/favoritos');
  return { favorited: true };
};

export const getUserProfile = async () => {
  const session = await auth();
  if (!session?.user?.email) throw new Error('Não autorizado');
  const user = await prismaNeon.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      company: true,
      document: true,
      address: true,
      city: true,
      state: true,
      zipCode: true
    }
  });
  return user;
};

export const updateUserProfile = async (data: {
  name: string;
  phone?: string;
  company?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}) => {
  const userId = await getUserId();
  const currentUser = await prismaNeon.userHistory.findUnique({
    where: { id: userId }
  });
  if (!currentUser) throw new Error('Usuário não encontrado');
  await prismaNeon.userHistory.create({
    data: {
      email: currentUser.email,
      name: data.name,
      password: currentUser.password,
      role: currentUser.role,
      status: currentUser.status,
      phone: data.phone,
      company: data.company,
      document: currentUser.document,
      address: data.address,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      version: currentUser.version + 1
    }
  });
  revalidatePath('/minha-conta');
  return { success: true };
};
