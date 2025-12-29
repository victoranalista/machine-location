'use server';
import { UserStatus, Role } from '@prisma/client';
import { bulkUpdateUserStatus } from '../bulkTransaction';
import { BulkParams } from '../types';
import { requireSession } from '@/lib/auth/requireSession';

export async function bulkActivateUsers({
  userHistoryIds
}: BulkParams): Promise<{
  success: boolean;
  message?: string;
  error?: string;
}> {
  await requireSession([Role.ADMIN]);
  if (!Array.isArray(userHistoryIds) || userHistoryIds.length === 0)
    return { success: false, error: 'Nenhum usuário selecionado' };
  try {
    await bulkUpdateUserStatus(userHistoryIds, UserStatus.ACTIVE);
    return { success: true, message: 'Usuários ativados com sucesso' };
  } catch (error) {
    console.error('Error activating users');
    return { success: false, error: 'Erro ao ativar os usuários' };
  }
}
