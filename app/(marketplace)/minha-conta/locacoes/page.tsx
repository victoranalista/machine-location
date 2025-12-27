import { getUserRentals } from '../actions';
import { RentalsClient } from './components/RentalsClient';

type PageProps = {
  searchParams: Promise<{ status?: string }>;
};

const LocacoesPage = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const rentals = await getUserRentals();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Minhas Locações</h1>
        <p className="text-muted-foreground">
          Acompanhe e gerencie suas locações de equipamentos
        </p>
      </div>
      <RentalsClient rentals={rentals} initialFilter={params.status} />
    </div>
  );
};

export default LocacoesPage;
