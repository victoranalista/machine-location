import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { EquipmentList } from './components/EquipmentList';
import { EquipmentFilters } from './components/EquipmentFilters';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata = {
  title: 'Meus Equipamentos | Portal do Fornecedor',
  description: 'Gerencie seus equipamentos'
};

const EquipmentPage = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Meus Equipamentos</h1>
        <p className="text-muted-foreground">
          Gerencie seu catálogo de equipamentos
        </p>
      </div>
      <Link href="/fornecedor/equipamentos/novo">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Equipamento
        </Button>
      </Link>
    </div>
    <Suspense fallback={<Skeleton className="h-20" />}>
      <EquipmentFilters />
    </Suspense>
    <Suspense fallback={<Skeleton className="h-96" />}>
      <EquipmentList />
    </Suspense>
  </div>
);

export default EquipmentPage;
