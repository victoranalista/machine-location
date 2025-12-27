import { Suspense } from 'react';
import { getAdminRentals } from '../actions';
import { RentalsTable } from './components/RentalsTable';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata = {
  title: 'Locações | Admin',
  description: 'Gerenciamento de locações'
};

type SearchParams = { status?: string; page?: string };

const TableLoading = () => (
  <div className="space-y-4">
    <Skeleton className="h-10 w-full" />
    {[1, 2, 3, 4, 5].map((i) => (
      <Skeleton key={i} className="h-20 w-full" />
    ))}
  </div>
);

const RentalsContent = async ({
  searchParams
}: {
  searchParams: SearchParams;
}) => {
  const page = Number(searchParams.page) || 1;
  const status = searchParams.status ?? 'all';

  const result = await getAdminRentals(page, 10, status);

  return <RentalsTable data={result} page={page} status={status} />;
};

const AdminLocacoesPage = async ({
  searchParams
}: {
  searchParams: Promise<SearchParams>;
}) => {
  const params = await searchParams;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Locações</h1>
        <p className="text-muted-foreground">
          Gerencie todas as locações do sistema
        </p>
      </div>
      <Suspense fallback={<TableLoading />}>
        <RentalsContent searchParams={params} />
      </Suspense>
    </div>
  );
};

export default AdminLocacoesPage;
