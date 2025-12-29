'use server';

import { auth } from '@/lib/auth/auth';
import { prismaNeon } from '@/lib/prisma/prismaNeon';
import { revalidatePath } from 'next/cache';

type ProfileInput = {
  name: string;
  company?: string;
  phone?: string;
  document?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
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

export const getSupplierProfile = async () => {
  const supplierId = await getSupplierId();
  const user = await prismaNeon.user.findUnique({
    where: { id: supplierId },
    select: {
      name: true,
      company: true,
      phone: true,
      document: true,
      address: true,
      city: true,
      state: true,
      zipCode: true
    }
  });
  if (!user) throw new Error('Perfil não encontrado');
  return user;
};

export const updateSupplierProfile = async (input: ProfileInput) => {
  const supplierId = await getSupplierId();
  await prismaNeon.user.update({
    where: { id: supplierId },
    data: input
  });
  revalidatePath('/fornecedor/configuracoes');
  return { success: true };
};
