'use server';

import { auth } from '@/lib/auth/auth';
import { prismaNeon } from '@/lib/prisma/prismaNeon';
import { revalidatePath } from 'next/cache';
import { EquipmentStatus } from '@prisma/client';

type EquipmentInput = {
  name: string;
  description: string;
  shortDescription?: string;
  categoryId: string;
  brandId?: string;
  model?: string;
  year?: number;
  dailyRate: number;
  weeklyRate?: number;
  monthlyRate?: number;
  minRentalDays?: number;
  maxRentalDays?: number;
  depositAmount?: number;
  operatingWeight?: number;
  enginePower?: string;
  fuelType?: string;
  capacity?: string;
  dimensions?: string;
  features?: string[];
  mainImageUrl?: string;
  city?: string;
  state?: string;
  availableFrom?: Date;
  availableTo?: Date;
};

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

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const getSupplierEquipment = async (status?: EquipmentStatus) => {
  const supplierId = await getSupplierId();
  const equipment = await prismaNeon.equipment.findMany({
    where: {
      ownerId: supplierId,
      ...(status && { status })
    },
    include: {
      category: { select: { name: true } },
      brand: { select: { name: true } },
      _count: { select: { rentals: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
  return equipment.map((eq) => ({
    id: eq.id,
    name: eq.name,
    slug: eq.slug,
    shortDescription: eq.shortDescription,
    status: eq.status,
    dailyRate: Number(eq.dailyRate),
    weeklyRate: eq.weeklyRate ? Number(eq.weeklyRate) : null,
    monthlyRate: eq.monthlyRate ? Number(eq.monthlyRate) : null,
    mainImageUrl: eq.mainImageUrl,
    category: eq.category,
    brand: eq.brand,
    city: eq.city,
    state: eq.state,
    isApproved: eq.isApproved,
    totalRentals: eq._count.rentals,
    createdAt: eq.createdAt
  }));
};

export const getEquipmentById = async (id: string) => {
  const supplierId = await getSupplierId();
  const equipment = await prismaNeon.equipment.findFirst({
    where: { id, ownerId: supplierId },
    include: {
      category: { select: { id: true, name: true } },
      brand: { select: { id: true, name: true } },
      images: { orderBy: { sortOrder: 'asc' } },
      specs: { orderBy: { sortOrder: 'asc' } }
    }
  });
  if (!equipment) throw new Error('Equipamento não encontrado');
  return {
    ...equipment,
    dailyRate: Number(equipment.dailyRate),
    weeklyRate: equipment.weeklyRate ? Number(equipment.weeklyRate) : null,
    monthlyRate: equipment.monthlyRate ? Number(equipment.monthlyRate) : null,
    depositAmount: equipment.depositAmount
      ? Number(equipment.depositAmount)
      : null,
    operatingWeight: equipment.operatingWeight
      ? Number(equipment.operatingWeight)
      : null,
    latitude: equipment.latitude ? Number(equipment.latitude) : null,
    longitude: equipment.longitude ? Number(equipment.longitude) : null
  };
};

export const createEquipment = async (input: EquipmentInput) => {
  const supplierId = await getSupplierId();
  const slug = generateSlug(input.name);
  const equipment = await prismaNeon.equipment.create({
    data: {
      ...input,
      slug,
      ownerId: supplierId,
      status: EquipmentStatus.AVAILABLE,
      isApproved: false
    }
  });
  revalidatePath('/fornecedor/equipamentos');
  return { success: true, id: equipment.id };
};

export const updateEquipment = async (id: string, input: EquipmentInput) => {
  const supplierId = await getSupplierId();
  const equipment = await prismaNeon.equipment.findFirst({
    where: { id, ownerId: supplierId }
  });
  if (!equipment) throw new Error('Equipamento não encontrado');
  const slug =
    input.name !== equipment.name ? generateSlug(input.name) : equipment.slug;
  await prismaNeon.equipment.update({
    where: { id },
    data: { ...input, slug }
  });
  revalidatePath('/fornecedor/equipamentos');
  revalidatePath(`/fornecedor/equipamentos/${id}`);
  return { success: true };
};

export const updateEquipmentStatus = async (
  id: string,
  status: EquipmentStatus
) => {
  const supplierId = await getSupplierId();
  const equipment = await prismaNeon.equipment.findFirst({
    where: { id, ownerId: supplierId }
  });
  if (!equipment) throw new Error('Equipamento não encontrado');
  await prismaNeon.equipment.update({
    where: { id },
    data: { status }
  });
  revalidatePath('/fornecedor/equipamentos');
  return { success: true };
};

export const deleteEquipment = async (id: string) => {
  const supplierId = await getSupplierId();
  const equipment = await prismaNeon.equipment.findFirst({
    where: { id, ownerId: supplierId }
  });
  if (!equipment) throw new Error('Equipamento não encontrado');
  const hasRentals = await prismaNeon.rental.count({
    where: {
      equipmentId: id,
      status: { in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] }
    }
  });
  if (hasRentals > 0)
    throw new Error('Não é possível excluir equipamento com locações ativas');
  await prismaNeon.equipment.delete({ where: { id } });
  revalidatePath('/fornecedor/equipamentos');
  return { success: true };
};

export const getCategories = async () => {
  const categories = await prismaNeon.category.findMany({
    where: { parentId: null },
    select: { id: true, name: true, slug: true },
    orderBy: { name: 'asc' }
  });
  return categories;
};

export const getBrands = async () => {
  const brands = await prismaNeon.brand.findMany({
    select: { id: true, name: true, slug: true },
    orderBy: { name: 'asc' }
  });
  return brands;
};
