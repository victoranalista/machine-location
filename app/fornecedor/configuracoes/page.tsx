import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SupplierProfileForm } from './components/SupplierProfileForm';

export const metadata = {
  title: 'Configurações | Portal do Fornecedor',
  description: 'Gerencie suas configurações'
};

const ConfigPage = () => (
  <div className="mx-auto max-w-3xl space-y-6">
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
      <p className="text-muted-foreground">
        Gerencie suas informações e preferências
      </p>
    </div>
    <Card>
      <CardHeader>
        <CardTitle>Perfil do Fornecedor</CardTitle>
      </CardHeader>
      <CardContent>
        <SupplierProfileForm />
      </CardContent>
    </Card>
  </div>
);

export default ConfigPage;
