import { Suspense } from 'react';
import { getEquipmentList, getCategories, getBrands } from '../actions';
import { EquipmentFiltersClient } from './components/EquipmentFilters';
import { EquipmentGrid } from './components/EquipmentGrid';
import { SearchWithFilters } from './components/SearchWithFilters';
import { QuickFilters } from './components/QuickFilters';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

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
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: 9 }).map((_, i) => (
      <div key={i} className="space-y-3">
        <Skeleton className="aspect-[4/3] w-full rounded-xl" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-10 w-full" />
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
  const hasCategories = categories.length > 0;
  const hasBrands = brands.length > 0;
  const showFilters = hasCategories || hasBrands;
  return (
    <div className="min-h-screen">
      <div className="border-b bg-gradient-to-br from-background to-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-center">
              <Badge
                variant="outline"
                className="mb-4 animate-in fade-in slide-in-from-top-4 duration-700"
              >
                <Search className="mr-1 h-3 w-3" />
                Catálogo Completo
              </Badge>
              <h1 className="mb-4 animate-in fade-in slide-in-from-top-4 text-4xl font-bold tracking-tight duration-700 delay-100 md:text-5xl">
                Equipamentos para Locação
              </h1>
              <p className="animate-in fade-in slide-in-from-top-4 text-lg text-muted-foreground duration-700 delay-200">
                Encontre o equipamento perfeito para sua obra
              </p>
            </div>
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <SearchWithFilters
                initialSearch={params.search}
                initialCity={params.cidade}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
          <QuickFilters />
        </div>
        <Separator className="my-6" />
        <div className={showFilters ? 'flex gap-8' : ''}>
          {showFilters && (
            <aside className="hidden w-72 shrink-0 lg:block">
              <div className="sticky top-20">
                <EquipmentFiltersClient
                  categories={categories}
                  brands={brands}
                  currentFilters={filters}
                />
              </div>
            </aside>
          )}
          <main className={showFilters ? 'min-w-0 flex-1' : 'w-full'}>
            <Suspense fallback={<EquipmentListSkeleton />}>
              <EquipmentGrid
                equipment={equipment}
                pagination={pagination}
                currentFilters={filters}
                categories={categories}
                brands={brands}
              />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
};

export default EquipamentosPage;
