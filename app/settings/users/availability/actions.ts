'use server';
import { prisma } from '@/lib/prisma/prisma';
import { Role } from '@prisma/client';
import { IAvailabilityResponse } from '../types';
import { requireSession } from '@/lib/auth/requireSession';

const isRoleRequiresDocument = (role: Role): boolean =>
  role === Role.ADMIN || role === Role.USER;

const validateLength = (cleanId: string): IAvailabilityResponse => {
  if (cleanId.length !== 11) {
    return {
      available: false,
      message: 'Documento deve conter 11 dígitos numéricos'
    };
  }
  return { available: true };
};

const validateFormat = (cleanId: string): IAvailabilityResponse => {
  // Simple validation - check if all characters are digits
  if (!/^\d{11}$/.test(cleanId)) {
    return {
      available: false,
      message: 'Documento inválido'
    };
  }
  return { available: true };
};

const checkExistence = async (
  cleanId: string
): Promise<IAvailabilityResponse> => {
  const exists = await prisma.user.findFirst({
    where: {
      document: cleanId
    },
    select: { id: true }
  });
  if (exists) {
    return {
      available: false,
      message: 'Documento já está em uso'
    };
  }
  return { available: true };
};

export const checkDocumentAvailability = async (
  document: string,
  role: Role
): Promise<IAvailabilityResponse> => {
  await requireSession([Role.ADMIN]);
  if (!isRoleRequiresDocument(role)) {
    return { available: true };
  }
  if (!document) {
    return {
      available: false,
      message: 'Documento é obrigatório'
    };
  }
  const cleanId = document.replace(/\D/g, '');
  const lengthCheck = validateLength(cleanId);
  if (!lengthCheck.available) return lengthCheck;
  const formatCheck = validateFormat(cleanId);
  if (!formatCheck.available) return formatCheck;
  try {
    return await checkExistence(cleanId);
  } catch {
    return {
      available: false,
      message: 'Erro interno do servidor'
    };
  }
};
