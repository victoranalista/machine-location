import { prisma } from '@/lib/prisma/prisma';
import EditUserForm from './EditUserForm';
import { EditFormValues } from '../../types';
import { ActivationStatus, Role } from '@/prisma/generated/prisma/client';

export default async function EditUserPage({
  params
}: {
  params: Promise<{ id: number }>;
}) {
  const userId = (await params).id;
  const userData = await prisma.userHistory.findUnique({
    where: { id: Number(userId) },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      user: {
        select: {
          taxpayerId: true
        }
      }
    }
  });
  if (!userData)
    return (
      <div className="text-center text-red-500">Usuário não encontrado.</div>
    );
  const initialValues: EditFormValues = {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    role: userData.role,
    status: userData.status,
    taxpayerId: userData.user.taxpayerId,
    password: ''
  };
  return <EditUserForm initialValues={initialValues} />;
}
