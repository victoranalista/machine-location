'use server';

import { auth } from '@/lib/auth/auth';
import { prismaNeon } from '@/lib/prisma/prismaNeon';
import { revalidatePath } from 'next/cache';
import { nanoid } from 'nanoid';
import { RentalStatus, PaymentStatus } from '@/prisma/generated/prisma/client';

type CartItemInput = {
  equipmentId: string;
  startDate: Date;
  endDate: Date;
};

type CreateRentalInput = {
  equipmentId: string;
  startDate: Date;
  endDate: Date;
  deliveryAddress?: string;
  deliveryCity?: string;
  deliveryState?: string;
  deliveryZip?: string;
  deliveryNotes?: string;
  notes?: string;
};

const getSessionId = async () => {
  const session = await auth();
  return session?.user?.email ?? nanoid();
};

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

export const addToCart = async (input: CartItemInput) => {
  const sessionId = await getSessionId();
  const session = await auth();
  const existing = await prismaNeon.cartItem.findUnique({
    where: {
      sessionId_equipmentId: { sessionId, equipmentId: input.equipmentId }
    }
  });
  if (existing) {
    await prismaNeon.cartItem.update({
      where: { id: existing.id },
      data: { startDate: input.startDate, endDate: input.endDate }
    });
  } else {
    await prismaNeon.cartItem.create({
      data: {
        sessionId,
        userId: session?.user?.email ?? null,
        equipmentId: input.equipmentId,
        startDate: input.startDate,
        endDate: input.endDate
      }
    });
  }
  revalidatePath('/carrinho');
  return { success: true };
};

export const removeFromCart = async (equipmentId: string) => {
  const sessionId = await getSessionId();
  await prismaNeon.cartItem.delete({
    where: { sessionId_equipmentId: { sessionId, equipmentId } }
  });
  revalidatePath('/carrinho');
  return { success: true };
};

export const getCartItems = async () => {
  const sessionId = await getSessionId();
  const items = await prismaNeon.cartItem.findMany({
    where: { sessionId },
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
  return items.map((item) => ({
    id: item.id,
    equipmentId: item.equipmentId,
    startDate: item.startDate,
    endDate: item.endDate,
    equipment: {
      id: item.equipment.id,
      name: item.equipment.name,
      slug: item.equipment.slug,
      mainImageUrl: item.equipment.mainImageUrl,
      dailyRate: Number(item.equipment.dailyRate),
      weeklyRate: item.equipment.weeklyRate
        ? Number(item.equipment.weeklyRate)
        : null,
      monthlyRate: item.equipment.monthlyRate
        ? Number(item.equipment.monthlyRate)
        : null,
      brand: item.equipment.brand,
      category: item.equipment.category,
      city: item.equipment.city,
      state: item.equipment.state
    }
  }));
};

export const getCartCount = async () => {
  const sessionId = await getSessionId();
  return prismaNeon.cartItem.count({ where: { sessionId } });
};

export const clearCart = async () => {
  const sessionId = await getSessionId();
  await prismaNeon.cartItem.deleteMany({ where: { sessionId } });
  revalidatePath('/carrinho');
  return { success: true };
};

const calculateRentalDays = (startDate: Date, endDate: Date) => {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

const calculateRentalPrice = (
  dailyRate: number,
  weeklyRate: number | null,
  monthlyRate: number | null,
  days: number
) => {
  if (monthlyRate && days >= 30)
    return { rate: monthlyRate / 30, type: 'monthly' as const };
  if (weeklyRate && days >= 7)
    return { rate: weeklyRate / 7, type: 'weekly' as const };
  return { rate: dailyRate, type: 'daily' as const };
};

export const createRental = async (input: CreateRentalInput) => {
  const userId = await getUserId();
  const equipment = await prismaNeon.equipment.findUnique({
    where: { id: input.equipmentId },
    select: {
      dailyRate: true,
      weeklyRate: true,
      monthlyRate: true,
      depositAmount: true
    }
  });
  if (!equipment) throw new Error('Equipamento não encontrado');
  const totalDays = calculateRentalDays(input.startDate, input.endDate);
  const pricing = calculateRentalPrice(
    Number(equipment.dailyRate),
    equipment.weeklyRate ? Number(equipment.weeklyRate) : null,
    equipment.monthlyRate ? Number(equipment.monthlyRate) : null,
    totalDays
  );
  const subtotal = pricing.rate * totalDays;
  const deliveryFee = 0;
  const insuranceFee = subtotal * 0.05;
  const total = subtotal + deliveryFee + insuranceFee;
  const rental = await prismaNeon.rental.create({
    data: {
      rentalNumber: `LOC-${nanoid(8).toUpperCase()}`,
      userId,
      equipmentId: input.equipmentId,
      startDate: input.startDate,
      endDate: input.endDate,
      totalDays,
      dailyRate: pricing.rate,
      subtotal,
      deliveryFee,
      insuranceFee,
      total,
      depositAmount: equipment.depositAmount,
      status: RentalStatus.PENDING,
      paymentStatus: PaymentStatus.PENDING,
      deliveryAddress: input.deliveryAddress,
      deliveryCity: input.deliveryCity,
      deliveryState: input.deliveryState,
      deliveryZip: input.deliveryZip,
      deliveryNotes: input.deliveryNotes,
      notes: input.notes
    }
  });
  const sessionId = await getSessionId();
  await prismaNeon.cartItem.delete({
    where: {
      sessionId_equipmentId: { sessionId, equipmentId: input.equipmentId }
    }
  });
  revalidatePath('/carrinho');
  revalidatePath('/minha-conta/locacoes');
  return { success: true, rentalNumber: rental.rentalNumber };
};
