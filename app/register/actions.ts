'use server';

import { prisma } from '@/lib/prisma/prisma';
import { hashPassword } from '@/lib/auth/password';
import { Role } from '@/prisma/generated/prisma/client';

type RegisterData = {
  name: string;
  email: string;
  password: string;
  role: Role;
};

export const registerUser = async (data: RegisterData) => {
  const { name, email, password, role } = data;

  // Verificar se o email já existe
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    return { success: false, error: 'Este e-mail já está cadastrado' };
  }

  // Criar o usuário
  const hashedPassword = await hashPassword(password);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role || 'USER'
    }
  });

  return { success: true };
};
