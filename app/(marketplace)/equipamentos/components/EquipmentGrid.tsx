'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { EquipmentCardComponent } from '../../components/EquipmentCard';
import {
  EquipmentCard,
  EquipmentFilters,
  CategoryWithCount
} from '../../actions';
import {
  PackageSearch,
  SlidersHorizontal,
  LayoutGrid,
  LayoutList
} from 'lucide-react';
import { EquipmentFiltersClient } from './EquipmentFilters';
import { useState } from 'react';

type Brand = {
  id: string;
  name: string;
  slug: string;
  equipmentCount: number;
};

type EquipmentGridProps = {
  equipment: EquipmentCard[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  currentFilters: EquipmentFilters;
  categories: CategoryWithCount[];
  brands: Brand[];
};

const addEllipsisIfNeeded = (
  pages: (number | 'ellipsis')[],
  condition: boolean
) => {
  if (condition) pages.push('ellipsis');
};

const generatePageNumbers = (current: number, total: number) => {
  const pages: (number | 'ellipsis')[] = [];
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  pages.push(1);
  addEllipsisIfNeeded(pages, current > 3);
  for (
    let i = Math.max(2, current - 1);
    i <= Math.min(total - 1, current + 1);
    i++
  ) {
    pages.push(i);
  }
  addEllipsisIfNeeded(pages, current < total - 2);
  pages.push(total);
  return pages;
};

const EquipmentGrid = ({
  equipment,
  pagination,
  currentFilters,
  categories,
  brands
}: EquipmentGridProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('orderBy', value);
    params.delete('page');
    router.push(`/equipamentos?${params.toString()}`);
  };
  const getPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    return `/equipamentos?${params.toString()}`;
  };
  if (equipment.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-24 text-center">
        <PackageSearch className="mb-4 h-20 w-20 text-muted-foreground/50" />
        <h3 className="mb-2 text-2xl font-semibold">
          Nenhum equipamento encontrado
        </h3>
        <p className="mb-8 max-w-md text-muted-foreground">
          Não encontramos equipamentos com os filtros selecionados. Tente
          ajustar os critérios de busca.
        </p>
        <Link href="/equipamentos">
          <Button size="lg">Ver todos equipamentos</Button>
        </Link>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <p className="text-sm font-medium">
            <span className="text-foreground">{pagination.total}</span>
            <span className="text-muted-foreground"> equipamentos</span>
          </p>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 lg:hidden">
                <SlidersHorizontal className="h-4 w-4" />
                Filtros
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px]">
              <SheetHeader className="mb-6">
                <SheetTitle>Filtros</SheetTitle>
              </SheetHeader>
              <EquipmentFiltersClient
                categories={categories}
                brands={brands}
                currentFilters={currentFilters}
              />
            </SheetContent>
          </Sheet>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1 rounded-lg border p-1 sm:flex">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('list')}
            >
              <LayoutList className="h-4 w-4" />
            </Button>
          </div>
          <Select
            value={currentFilters.sortBy ?? 'newest'}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Mais recentes</SelectItem>
              <SelectItem value="price_asc">Menor preço</SelectItem>
              <SelectItem value="price_desc">Maior preço</SelectItem>
              <SelectItem value="popular">Mais populares</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div
        className={
          viewMode === 'grid'
            ? 'grid gap-4 sm:grid-cols-2 xl:grid-cols-3'
            : 'space-y-3'
        }
      >
        {equipment.map((eq, index) => (
          <div
            key={eq.id}
            className="animate-in fade-in zoom-in-95 duration-500"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <EquipmentCardComponent equipment={eq} />
          </div>
        ))}
      </div>
      {pagination.totalPages > 1 && (
        <div className="flex justify-center pt-6">
          <Pagination>
            <PaginationContent>
              {pagination.page > 1 && (
                <PaginationItem>
                  <PaginationPrevious href={getPageUrl(pagination.page - 1)} />
                </PaginationItem>
              )}
              {generatePageNumbers(pagination.page, pagination.totalPages).map(
                (page, index) =>
                  page === 'ellipsis' ? (
                    <PaginationItem key={`ellipsis-${index}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href={getPageUrl(page)}
                        isActive={page === pagination.page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
              )}
              {pagination.page < pagination.totalPages && (
                <PaginationItem>
                  <PaginationNext href={getPageUrl(pagination.page + 1)} />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export { EquipmentGrid };
