import { Suspense } from 'react';
import { StatsCards } from './components/StatsCards';
import { RecentRentals } from './components/RecentRentals';
import { EquipmentPerformance } from './components/EquipmentPerformance';
import { RevenueChart } from './components/RevenueChart';
import { QuickActions } from './components/QuickActions';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata = {
  title: 'Dashboard | Portal do Fornecedor',
  description: 'Gerencie seus equipamentos e locações'
};

const DashboardPage = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <p className="text-muted-foreground">
        Visão geral do seu negócio e desempenho
      </p>
    </div>
    <Suspense fallback={<Skeleton className="h-32" />}>
      <QuickActions />
    </Suspense>
    <Suspense fallback={<Skeleton className="h-48" />}>
      <StatsCards />
    </Suspense>
    <div className="grid gap-6 lg:grid-cols-7">
      <Suspense fallback={<Skeleton className="h-96 lg:col-span-4" />}>
        <RevenueChart />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-96 lg:col-span-3" />}>
        <EquipmentPerformance />
      </Suspense>
    </div>
    <Suspense fallback={<Skeleton className="h-96" />}>
      <RecentRentals />
    </Suspense>
  </div>
);

export default DashboardPage;
