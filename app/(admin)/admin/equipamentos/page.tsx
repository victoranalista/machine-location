import { Suspense } from 'react';
import {
  getAdminEquipmentList,
  getAdminCategories,
  getAdminBrands
} from '../actions';
import { EquipmentTable } from './components/EquipmentTable';
import { EquipmentHeader } from './components/EquipmentHeader';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata = {
  title: 'Equipamentos | Admin',
  description: 'Gerenciamento de equipamentos'
};

type SearchParams = { search?: string; page?: string };

const TableLoading = () => (
  <div className="space-y-4">
    <Skeleton className="h-10 w-full" />
    {[1, 2, 3, 4, 5].map((i) => (
      <Skeleton key={i} className="h-16 w-full" />
    ))}
  </div>
);

type EquipmentContentProps = {
  searchParams: SearchParams;
};

const EquipmentContent = async ({ searchParams }: EquipmentContentProps) => {
  const page = Number(searchParams.page) || 1;
  const search = searchParams.search ?? '';

  const [result, categories, brands] = await Promise.all([
    getAdminEquipmentList(page, 10, search),
    getAdminCategories(),
    getAdminBrands()
  ]);

  return (
    <EquipmentTable
      data={result}
      categories={categories}
      brands={brands}
      page={page}
      search={search}
    />
  );
};

type AdminEquipamentosPageProps = {
  searchParams: Promise<SearchParams>;
};

const AdminEquipamentosPage = async ({
  searchParams
}: AdminEquipamentosPageProps) => {
  const params = await searchParams;

  return (
    <div className="space-y-6">
      <EquipmentHeader />
      <Suspense fallback={<TableLoading />}>
        <EquipmentContent searchParams={params} />
      </Suspense>
    </div>
  );
};

export default AdminEquipamentosPage;
