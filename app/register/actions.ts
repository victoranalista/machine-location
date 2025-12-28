'use server';

import { prisma } from '@/lib/prisma/prisma';
import { hashPassword } from '@/lib/auth/password';
import { Role } from '@prisma/client';

type RegisterData = {
  name: string;
  email: string;
  password: string;
  role: Role;
};

export const registerUser = async (data: RegisterData) => {
  const { name, email, password, role } = data;

  // SEGURANÇA: Nunca permitir registro direto de ADMIN
  // Admins devem ser criados apenas por seed ou por outros admins
  if (role === 'ADMIN') {
    return {
      success: false,
      error:
        'Não é possível criar contas de administrador através do registro público'
    };
  }

  // Validar que role é USER ou SUPPLIER
  if (role !== 'USER' && role !== 'SUPPLIER') {
    return { success: false, error: 'Tipo de conta inválido' };
  }

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
