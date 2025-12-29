import { notFound } from 'next/navigation';
import { getEquipmentById } from '../actions';
import { EquipmentForm } from '../components/EquipmentForm';

type EditEquipmentPageProps = {
  params: { id: string };
};

export const metadata = {
  title: 'Editar Equipamento | Portal do Fornecedor',
  description: 'Edite as informações do equipamento'
};

const EditEquipmentPage = async ({ params }: EditEquipmentPageProps) => {
  const { id } = await params;
  try {
    const equipment = await getEquipmentById(id);
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Editar Equipamento
          </h1>
          <p className="text-muted-foreground">
            Atualize as informações do equipamento
          </p>
        </div>
        <EquipmentForm equipment={equipment} />
      </div>
    );
  } catch {
    notFound();
  }
};

export default EditEquipmentPage;
