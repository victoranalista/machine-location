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
import { EquipmentCardComponent } from '../../components/EquipmentCard';
import { EquipmentCard, EquipmentFilters } from '../../actions';
import { Grid3X3, List, PackageSearch } from 'lucide-react';

type EquipmentGridProps = {
  equipment: EquipmentCard[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  currentFilters: EquipmentFilters;
};

const generatePageNumbers = (current: number, total: number) => {
  const pages: (number | 'ellipsis')[] = [];
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  pages.push(1);
  if (current > 3) pages.push('ellipsis');
  for (
    let i = Math.max(2, current - 1);
    i <= Math.min(total - 1, current + 1);
    i++
  ) {
    pages.push(i);
  }
  if (current < total - 2) pages.push('ellipsis');
  pages.push(total);
  return pages;
};

const EquipmentGrid = ({
  equipment,
  pagination,
  currentFilters
}: EquipmentGridProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
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
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <PackageSearch className="mb-4 h-16 w-16 text-muted-foreground" />
        <h3 className="mb-2 text-xl font-semibold">
          Nenhum equipamento encontrado
        </h3>
        <p className="mb-6 text-muted-foreground">
          Tente ajustar os filtros ou fazer uma nova busca
        </p>
        <Link href="/equipamentos">
          <Button>Ver todos equipamentos</Button>
        </Link>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {pagination.total} equipamentos encontrados
        </p>
        <Select
          value={currentFilters.sortBy ?? 'newest'}
          onValueChange={handleSortChange}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Mais recentes</SelectItem>
            <SelectItem value="price_asc">Menor preço</SelectItem>
            <SelectItem value="price_desc">Maior preço</SelectItem>
            <SelectItem value="popular">Mais populares</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {equipment.map((eq) => (
          <EquipmentCardComponent key={eq.id} equipment={eq} />
        ))}
      </div>
      {pagination.totalPages > 1 && (
        <Pagination className="mt-8">
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
      )}
    </div>
  );
};

export { EquipmentGrid };
