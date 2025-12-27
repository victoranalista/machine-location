import { Suspense } from 'react';
import { getEquipmentList, getCategories, getBrands } from '../actions';
import { EquipmentFiltersClient } from './components/EquipmentFilters';
import { EquipmentGrid } from './components/EquipmentGrid';
import { Skeleton } from '@/components/ui/skeleton';

type PageProps = {
  searchParams: Promise<{
    search?: string;
    categoria?: string;
    marca?: string;
    cidade?: string;
    estado?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
    orderBy?: string;
  }>;
};

const EquipmentListSkeleton = () => (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 9 }).map((_, i) => (
      <div key={i} className="space-y-3">
        <Skeleton className="aspect-[4/3] w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    ))}
  </div>
);

const EquipamentosPage = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const [categories, brands] = await Promise.all([
    getCategories(),
    getBrands()
  ]);
  const filters = {
    search: params.search,
    categorySlug: params.categoria,
    brandSlug: params.marca,
    city: params.cidade,
    state: params.estado,
    minPrice: params.minPrice ? Number(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
    page: params.page ? Number(params.page) : 1,
    sortBy: params.orderBy as
      | 'price_asc'
      | 'price_desc'
      | 'newest'
      | 'popular'
      | undefined
  };
  const { equipment, pagination } = await getEquipmentList(filters);
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Equipamentos para Locação
        </h1>
        <p className="mt-2 text-muted-foreground">
          Encontre o equipamento perfeito para sua obra
        </p>
      </div>
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block">
          <EquipmentFiltersClient
            categories={categories}
            brands={brands}
            currentFilters={filters}
          />
        </aside>
        <main>
          <Suspense fallback={<EquipmentListSkeleton />}>
            <EquipmentGrid
              equipment={equipment}
              pagination={pagination}
              currentFilters={filters}
            />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default EquipamentosPage;
