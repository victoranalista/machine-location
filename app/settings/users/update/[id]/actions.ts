'use server';
import { Role } from '@/prisma/generated/prisma/client';
import { prisma } from '@/lib/prisma/prisma';
import checker from '../../versionChecker';
import { validationSchema } from '../../edit/[id]/validationSchema';
import { requireSession } from '@/lib/auth/requireSession';
import { UpdateUserDataInput } from '../../types';
import { ensurePasswordHashed } from '@/lib/auth/password';

const hasDataChanged = (check: any, validBody: UpdateUserDataInput) => {
  return (
    check.name !== validBody.name ||
    check.email !== validBody.email ||
    check.role !== validBody.role ||
    check.status !== validBody.status ||
    (validBody.password && validBody.password.trim().length > 0)
  );
};

const buildUpdateData = async (validBody: UpdateUserDataInput) => {
  const updateData: {
    name: string;
    email: string;
    role: Role;
    status: any;
    password?: string;
  } = {
    name: validBody.name,
    email: validBody.email,
    role: validBody.role,
    status: validBody.status
  };
  if (validBody.password && validBody.password.trim().length > 0) {
    updateData.password = await ensurePasswordHashed(validBody.password.trim());
  }
  return updateData;
};

export async function updateUserDataAction(data: UpdateUserDataInput) {
  try {
    await requireSession([Role.ADMIN]);
    const validBody = await validationSchema.parse(data);
    if (!validBody) return { success: false, message: 'Dados inválidos' };
    const { id: userHistoryId } = validBody;
    try {
      await prisma.$transaction(async (tx) => {
        const check = await checker(tx, userHistoryId);
        if (!check) throw new Error('Usuário não encontrado');
        if (!hasDataChanged(check, validBody)) {
          throw new Error('Nenhum dado foi modificado');
        }
        const existingUserHistory = await tx.userHistory.findUnique({
          where: { id: userHistoryId }
        });
        if (!existingUserHistory) {
          throw new Error('Registro de histórico não encontrado');
        }
        const existingUser = await tx.user.findUnique({
          where: { id: check.userId }
        });
        if (!existingUser) {
          throw new Error('Registro de usuário não encontrado');
        }
        const updateData = await buildUpdateData(validBody);
        await Promise.all([
          tx.userHistory.update({
            where: { id: userHistoryId },
            data: updateData
          }),
          tx.user.update({
            where: { id: check.userId },
            data: { status: validBody.status }
          })
        ]);
      });
      return { success: true, message: 'Usuário atualizado com sucesso' };
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as { message: unknown }).message === 'string'
      ) {
        const msg = (error as { message: string }).message;
        if (
          msg === 'Nenhum dado foi modificado' ||
          msg === 'Usuário não encontrado' ||
          msg === 'Registro de histórico não encontrado' ||
          msg === 'Registro de usuário não encontrado'
        ) {
          return { success: false, message: msg };
        }
        console.error('Error updating user');
        return { success: false, message: 'Erro ao atualizar usuário' };
      }
      console.error('Error updating user');
      return { success: false, message: 'Erro ao atualizar usuário' };
    }
  } catch (error: unknown) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof (error as { message: unknown }).message === 'string'
    ) {
      return {
        success: false,
        message: (error as { message: string }).message
      };
    }
    return { success: false, message: 'Dados inválidos' };
  }
}
