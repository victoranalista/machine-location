'use server';
import { Role } from '@prisma/client';
import { prisma } from '@/lib/prisma/prisma';
import { validationSchema } from '../../edit/[id]/validationSchema';
import { requireSession } from '@/lib/auth/requireSession';
import { UpdateUserDataInput } from '../../types';
import { ensurePasswordHashed } from '@/lib/auth/password';

export async function updateUserDataAction(data: UpdateUserDataInput) {
  try {
    await requireSession([Role.ADMIN]);
    const validBody = await validationSchema.parse(data);

    if (!validBody) {
      return { success: false, message: 'Dados inválidos' };
    }

    const { id: userId } = validBody;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true
      }
    });

    if (!existingUser) {
      return { success: false, message: 'Usuário não encontrado' };
    }

    // Check if data changed
    const hasChanges =
      existingUser.name !== validBody.name ||
      existingUser.email !== validBody.email ||
      existingUser.role !== validBody.role ||
      existingUser.status !== validBody.status ||
      (validBody.password && validBody.password.trim().length > 0);

    if (!hasChanges) {
      return { success: false, message: 'Nenhum dado foi modificado' };
    }

    // Build update data
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
      updateData.password = await ensurePasswordHashed(
        validBody.password.trim()
      );
    }

    // Update user
    await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    return { success: true, message: 'Usuário atualizado com sucesso' };
  } catch (error: unknown) {
    console.error('Error updating user:', error);
    return { success: false, message: 'Erro ao atualizar usuário' };
  }
}
