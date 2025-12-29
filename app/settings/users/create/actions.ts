'use server';
import { prisma } from '@/lib/prisma/prisma';
import { Role, UserStatus } from '@prisma/client';
import { requireSession } from '@/lib/auth/requireSession';
import { ensurePasswordHashed } from '@/lib/auth/password';

interface UserData {
  name: string;
  email: string;
  document: string;
  role: Role;
  password: string;
}

interface ActionResult {
  success: boolean;
  message?: string;
}

const cleanDocument = (doc: string): string => doc.replace(/\D/g, '');

const isValidDocument = (doc: string): boolean => {
  const clean = cleanDocument(doc);
  return clean.length === 11 && /^\d{11}$/.test(clean);
};

const validateUserData = (data: UserData): string | null => {
  if (!data.name?.trim()) return 'Nome é obrigatório';
  if (!data.email?.trim()) return 'Email é obrigatório';
  if (!data.document?.trim()) return 'CPF é obrigatório';
  if (!data.password || data.password.length < 6)
    return 'Senha deve ter pelo menos 6 caracteres';
  if (!isValidDocument(data.document)) return 'CPF inválido';
  return null;
};

const prepareUserData = async (data: UserData) => ({
  document: cleanDocument(data.document),
  name: data.name.trim(),
  email: data.email.trim().toLowerCase(),
  role: data.role,
  status: UserStatus.ACTIVE,
  password: await ensurePasswordHashed(data.password.trim())
});

const checkUserAvailability = async (
  email: string,
  document: string,
  excludeId?: string
) => {
  const cleanDoc = cleanDocument(document);
  const [existingEmail, existingDocument] = await Promise.all([
    prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
        ...(excludeId && { id: { not: excludeId } })
      },
      select: { id: true }
    }),
    prisma.user.findFirst({
      where: {
        document: cleanDoc,
        ...(excludeId && { id: { not: excludeId } })
      },
      select: { id: true }
    })
  ]);
  if (existingEmail) return 'Email já está em uso';
  if (existingDocument) return 'CPF já está em uso';
  return null;
};

export const createUser = async (data: UserData): Promise<ActionResult> => {
  await requireSession([Role.ADMIN]);
  const validation = validateUserData(data);
  if (validation) return { success: false, message: validation };
  try {
    const availabilityError = await checkUserAvailability(
      data.email,
      data.document
    );
    if (availabilityError)
      return { success: false, message: availabilityError };
    const userData = await prepareUserData(data);
    await prisma.user.create({ data: userData });
    return { success: true, message: 'Usuário criado com sucesso' };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, message: 'Erro ao criar usuário' };
  }
};
