'use server';

import { auth } from '@/lib/auth/auth';
import { prismaNeon } from '@/lib/prisma/prismaNeon';
import { RentalStatus } from '@prisma/client';

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

export const getSupplierRentals = async (status?: RentalStatus) => {
  const supplierId = await getSupplierId();
  const rentals = await prismaNeon.rental.findMany({
    where: {
      equipment: { ownerId: supplierId },
      ...(status && { status })
    },
    include: {
      equipment: { select: { name: true, mainImageUrl: true } },
      user: { select: { name: true, email: true, phone: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
  return rentals.map((rental) => ({
    id: rental.id,
    rentalNumber: rental.rentalNumber,
    status: rental.status,
    paymentStatus: rental.paymentStatus,
    startDate: rental.startDate,
    endDate: rental.endDate,
    totalDays: rental.totalDays,
    total: Number(rental.total),
    depositAmount: rental.depositAmount ? Number(rental.depositAmount) : null,
    depositPaid: rental.depositPaid,
    deliveryAddress: rental.deliveryAddress,
    deliveryCity: rental.deliveryCity,
    deliveryState: rental.deliveryState,
    deliveryZip: rental.deliveryZip,
    deliveryNotes: rental.deliveryNotes,
    notes: rental.notes,
    equipment: rental.equipment,
    user: rental.user,
    createdAt: rental.createdAt,
    confirmedAt: rental.confirmedAt,
    startedAt: rental.startedAt,
    completedAt: rental.completedAt,
    cancelledAt: rental.cancelledAt,
    cancelReason: rental.cancelReason
  }));
};

export const getRentalsStats = async () => {
  const supplierId = await getSupplierId();
  const [pending, confirmed, inProgress, completed] = await Promise.all([
    prismaNeon.rental.count({
      where: {
        equipment: { ownerId: supplierId },
        status: RentalStatus.PENDING
      }
    }),
    prismaNeon.rental.count({
      where: {
        equipment: { ownerId: supplierId },
        status: RentalStatus.CONFIRMED
      }
    }),
    prismaNeon.rental.count({
      where: {
        equipment: { ownerId: supplierId },
        status: RentalStatus.IN_PROGRESS
      }
    }),
    prismaNeon.rental.count({
      where: {
        equipment: { ownerId: supplierId },
        status: RentalStatus.COMPLETED
      }
    })
  ]);
  return { pending, confirmed, inProgress, completed };
};

export const getRentalDetails = async (id: string) => {
  const supplierId = await getSupplierId();
  const rental = await prismaNeon.rental.findFirst({
    where: {
      id,
      equipment: { ownerId: supplierId }
    },
    include: {
      equipment: {
        select: {
          name: true,
          mainImageUrl: true,
          brand: { select: { name: true } },
          category: { select: { name: true } }
        }
      },
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
          company: true,
          document: true
        }
      }
    }
  });
  if (!rental) throw new Error('Locação não encontrada');
  return {
    ...rental,
    total: Number(rental.total),
    subtotal: Number(rental.subtotal),
    dailyRate: Number(rental.dailyRate),
    deliveryFee: rental.deliveryFee ? Number(rental.deliveryFee) : null,
    insuranceFee: rental.insuranceFee ? Number(rental.insuranceFee) : null,
    discount: rental.discount ? Number(rental.discount) : null,
    depositAmount: rental.depositAmount ? Number(rental.depositAmount) : null
  };
};
