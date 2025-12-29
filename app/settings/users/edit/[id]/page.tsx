import { prisma } from '@/lib/prisma/prisma';
import EditUserForm from './EditUserForm';
import { EditFormValues } from '../../types';
import { UserStatus, Role } from '@prisma/client';

export default async function EditUserPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const userId = (await params).id;
  const userData = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      document: true
    }
  });

  if (!userData) {
    return (
      <div className="text-center text-red-500">Usuário não encontrado.</div>
    );
  }

  const initialValues: EditFormValues = {
    id: userData.id,
    name: userData.name ?? '',
    email: userData.email,
    role: userData.role,
    status: userData.status,
    document: userData.document ?? '',
    password: ''
  };

  return <EditUserForm initialValues={initialValues} />;
}
