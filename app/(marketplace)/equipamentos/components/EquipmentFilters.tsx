'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';
import { CategoryWithCount, EquipmentFilters } from '../../actions';

type Brand = {
  id: string;
  name: string;
  slug: string;
  equipmentCount: number;
};

type EquipmentFiltersClientProps = {
  categories: CategoryWithCount[];
  brands: Brand[];
  currentFilters: EquipmentFilters;
};

const EquipmentFiltersClient = ({
  categories,
  brands,
  currentFilters
}: EquipmentFiltersClientProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const updateFilter = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      params.delete('page');
      router.push(`/equipamentos?${params.toString()}`);
    },
    [router, searchParams]
  );
  const clearFilters = () => router.push('/equipamentos');
  const hasFilters = Object.values(currentFilters).some((v) => v !== undefined);
  return (
    <Card className="sticky top-20">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg">Filtros</CardTitle>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="mr-1 h-4 w-4" />
            Limpar
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Categorias</Label>
          <ScrollArea className="h-48">
            <div className="space-y-2 pr-4">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <Checkbox
                    checked={currentFilters.categorySlug === category.slug}
                    onCheckedChange={(checked) =>
                      updateFilter('categoria', checked ? category.slug : null)
                    }
                  />
                  <span className="flex-1 text-sm">{category.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({category.equipmentCount})
                  </span>
                </label>
              ))}
            </div>
          </ScrollArea>
        </div>
        <Separator />
        <div className="space-y-3">
          <Label>Marcas</Label>
          <ScrollArea className="h-48">
            <div className="space-y-2 pr-4">
              {brands.map((brand) => (
                <label
                  key={brand.id}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <Checkbox
                    checked={currentFilters.brandSlug === brand.slug}
                    onCheckedChange={(checked) =>
                      updateFilter('marca', checked ? brand.slug : null)
                    }
                  />
                  <span className="flex-1 text-sm">{brand.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({brand.equipmentCount})
                  </span>
                </label>
              ))}
            </div>
          </ScrollArea>
        </div>
        <Separator />
        <div className="space-y-3">
          <Label>Preço por dia</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Mín"
              value={currentFilters.minPrice ?? ''}
              onChange={(e) => updateFilter('minPrice', e.target.value || null)}
            />
            <Input
              type="number"
              placeholder="Máx"
              value={currentFilters.maxPrice ?? ''}
              onChange={(e) => updateFilter('maxPrice', e.target.value || null)}
            />
          </div>
        </div>
        <Separator />
        <div className="space-y-3">
          <Label>Localização</Label>
          <Input
            placeholder="Cidade"
            value={currentFilters.city ?? ''}
            onChange={(e) => updateFilter('cidade', e.target.value || null)}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export { EquipmentFiltersClient };
