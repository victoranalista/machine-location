import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import { prisma } from '@/lib/prisma/prisma';
import { EquipmentForm } from '../components/EquipmentForm';
import { notFound } from 'next/navigation';

const EditEquipamentoPage = async ({
  params
}: {
  params: Promise<{ id: string }>;
}) => {
  const session = await auth();
  if (!session?.user) redirect('/login');
  const { id } = await params;
  const equipment = await prisma.equipment.findUnique({
    where: { id, ownerId: session.user.id },
    include: { category: true, brand: true }
  });
  if (!equipment) notFound();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Editar Equipamento</h1>
        <p className="text-muted-foreground">
          Atualize as informações do equipamento
        </p>
      </div>
      <EquipmentForm equipment={equipment} />
    </div>
  );
};

export default EditEquipamentoPage;
