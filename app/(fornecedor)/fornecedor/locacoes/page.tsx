import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import { RentalsList } from './components/RentalsList';

const LocacoesPage = async () => {
  const session = await auth();
  if (!session?.user) redirect('/login');
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Locações Recebidas</h1>
        <p className="text-muted-foreground">
          Acompanhe as locações dos seus equipamentos
        </p>
      </div>
      <RentalsList />
    </div>
  );
};

export default LocacoesPage;
