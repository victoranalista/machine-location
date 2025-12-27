'use server';
import {
  cleanTaxpayerId,
  isValidTaxpayerId,
  handleActionError
} from '@/lib/validators';
import { prisma } from '@/lib/prisma/prisma';
import { Role, ActivationStatus } from '@/prisma/generated/prisma/client';
import { requireSession } from '@/lib/auth/requireSession';
import { ensurePasswordHashed } from '@/lib/auth/password';

interface UserData {
  name: string;
  email: string;
  taxpayerId: string;
  role: Role;
  password: string;
}

interface ActionResult {
  success: boolean;
  message?: string;
}

const validateUserData = (data: UserData): string | null => {
  if (!data.name?.trim()) return 'Nome é obrigatório';
  if (!data.email?.trim()) return 'Email é obrigatório';
  if (!data.taxpayerId?.trim()) return 'CPF é obrigatório';
  if (!data.password || data.password.length < 6)
    return 'Senha deve ter pelo menos 6 caracteres';
  if (!isValidTaxpayerId(data.taxpayerId)) return 'CPF inválido';
  return null;
};

const prepareUserData = async (data: UserData) => ({
  taxpayerId: cleanTaxpayerId(data.taxpayerId),
  status: ActivationStatus.ACTIVE,
  versions: {
    create: {
      version: 1,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      role: data.role,
      status: ActivationStatus.ACTIVE,
      password: await ensurePasswordHashed(data.password.trim())
    }
  }
});

const checkUserAvailability = async (
  email: string,
  taxpayerId: string,
  excludeId?: number
) => {
  const cleanId = cleanTaxpayerId(taxpayerId);
  const [existingEmail, existingTaxpayerId] = await Promise.all([
    prisma.userHistory.findFirst({
      where: {
        email: email.toLowerCase(),
        status: ActivationStatus.ACTIVE,
        ...(excludeId && { userId: { not: excludeId } })
      },
      select: { id: true }
    }),
    prisma.user.findFirst({
      where: {
        taxpayerId: cleanId,
        status: ActivationStatus.ACTIVE,
        ...(excludeId && { id: { not: excludeId } })
      },
      select: { id: true }
    })
  ]);
  if (existingEmail) return 'Email já está em uso';
  if (existingTaxpayerId) return 'CPF já está em uso';
  return null;
};

export const createUser = async (data: UserData): Promise<ActionResult> => {
  await requireSession([Role.ADMIN]);
  const validation = validateUserData(data);
  if (validation) return { success: false, message: validation };
  try {
    const availabilityError = await checkUserAvailability(
      data.email,
      data.taxpayerId
    );
    if (availabilityError)
      return { success: false, message: availabilityError };
    const userData = await prepareUserData(data);
    await prisma.user.create({ data: userData });
    return { success: true, message: 'Usuário criado com sucesso' };
  } catch (error) {
    console.error('Error creating user');
    return { success: false, message: 'Erro ao criar usuário' };
  }
};
