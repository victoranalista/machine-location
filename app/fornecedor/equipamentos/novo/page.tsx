import { EquipmentForm } from '../components/EquipmentForm';

export const metadata = {
  title: 'Novo Equipamento | Portal do Fornecedor',
  description: 'Cadastre um novo equipamento'
};

const NewEquipmentPage = () => (
  <div className="mx-auto max-w-4xl space-y-6">
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Novo Equipamento</h1>
      <p className="text-muted-foreground">
        Preencha as informações para cadastrar um novo equipamento
      </p>
    </div>
    <EquipmentForm />
  </div>
);

export default NewEquipmentPage;
