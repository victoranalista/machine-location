'use server';
import { UserStatus, Role } from '@prisma/client';
import { prisma } from '@/lib/prisma/prisma';
import { requireSession } from '@/lib/auth/requireSession';

type HumanStates = 'Ativo' | 'Inativo' | 'Suspenso';

export async function updateUserStatusAction(
  userId: string,
  status: HumanStates
): Promise<{ success: boolean; message?: string; error?: string }> {
  await requireSession([Role.ADMIN]);

  const translateStatus: Record<HumanStates, UserStatus> = {
    Ativo: UserStatus.ACTIVE,
    Inativo: UserStatus.INACTIVE,
    Suspenso: UserStatus.SUSPENDED
  };

  const translatedStatus = translateStatus[status];
  if (!translatedStatus) {
    return { success: false, error: 'Status inválido' };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { status: translatedStatus }
    });

    return { success: true, message: 'Status atualizado com sucesso' };
  } catch (error) {
    console.error('Error updating user status:', error);
    return { success: false, error: 'Erro ao atualizar status do usuário' };
  }
}
