import { Suspense } from 'react';
import { RentalsStats } from './components/RentalsStats';
import { RentalsFilters } from './components/RentalsFilters';
import { RentalsList } from './components/RentalsList';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata = {
  title: 'Locações | Portal do Fornecedor',
  description: 'Gerencie suas locações'
};

const RentalsPage = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Locações</h1>
      <p className="text-muted-foreground">
        Gerencie e acompanhe todas as suas locações
      </p>
    </div>
    <Suspense fallback={<Skeleton className="h-32" />}>
      <RentalsStats />
    </Suspense>
    <Suspense fallback={<Skeleton className="h-20" />}>
      <RentalsFilters />
    </Suspense>
    <Suspense fallback={<Skeleton className="h-96" />}>
      <RentalsList />
    </Suspense>
  </div>
);

export default RentalsPage;
