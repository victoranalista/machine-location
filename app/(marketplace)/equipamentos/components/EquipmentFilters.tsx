'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { X, Filter } from 'lucide-react';
import { CategoryWithCount, EquipmentFilters } from '../../actions';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { CurrencyInput } from './CurrencyInput';

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
  const [minPrice, setMinPrice] = useState(
    currentFilters.minPrice ? (currentFilters.minPrice * 100).toString() : ''
  );
  const [maxPrice, setMaxPrice] = useState(
    currentFilters.maxPrice ? (currentFilters.maxPrice * 100).toString() : ''
  );
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
  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    if (type === 'min') {
      setMinPrice(value);
      if (value) {
        const priceValue = (parseFloat(value) / 100).toString();
        updateFilter('minPrice', priceValue);
      } else {
        updateFilter('minPrice', null);
      }
    } else {
      setMaxPrice(value);
      if (value) {
        const priceValue = (parseFloat(value) / 100).toString();
        updateFilter('maxPrice', priceValue);
      } else {
        updateFilter('maxPrice', null);
      }
    }
  };
  const clearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    router.push('/equipamentos');
  };
  const hasFilters = Object.values(currentFilters).some((v) => v !== undefined);
  const hasCategories = categories.length > 0;
  const hasBrands = brands.length > 0;
  if (!hasCategories && !hasBrands) return null;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <h3 className="font-semibold">Filtros</h3>
        </div>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="mr-1 h-4 w-4" />
            Limpar
          </Button>
        )}
      </div>
      <Separator />
      <Accordion type="multiple" defaultValue={[]} className="w-full">
        {hasCategories && (
          <AccordionItem value="categories" className="border-none">
            <AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">
              Categorias
            </AccordionTrigger>
            <AccordionContent>
              <ScrollArea className="h-64 pr-4">
                <div className="space-y-3">
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className="group flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-accent"
                    >
                      <Checkbox
                        checked={currentFilters.categorySlug === category.slug}
                        onCheckedChange={(checked) =>
                          updateFilter(
                            'categoria',
                            checked ? category.slug : null
                          )
                        }
                      />
                      <span className="flex-1 text-sm font-medium">
                        {category.name}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {category.equipmentCount}
                      </Badge>
                    </label>
                  ))}
                </div>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>
        )}
        {hasCategories && hasBrands && <Separator />}
        {hasBrands && (
          <AccordionItem value="brands" className="border-none">
            <AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">
              Marcas
            </AccordionTrigger>
            <AccordionContent>
              <ScrollArea className="h-64 pr-4">
                <div className="space-y-3">
                  {brands.map((brand) => (
                    <label
                      key={brand.id}
                      className="group flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-accent"
                    >
                      <Checkbox
                        checked={currentFilters.brandSlug === brand.slug}
                        onCheckedChange={(checked) =>
                          updateFilter('marca', checked ? brand.slug : null)
                        }
                      />
                      <span className="flex-1 text-sm font-medium">
                        {brand.name}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {brand.equipmentCount}
                      </Badge>
                    </label>
                  ))}
                </div>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>
        )}
        <Separator />
        <AccordionItem value="price" className="border-none">
          <AccordionTrigger className="py-3 text-sm font-medium hover:no-underline">
            Preço diário
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="minPrice" className="text-xs">
                    Mínimo
                  </Label>
                  <CurrencyInput
                    value={minPrice}
                    onChange={(value) => handlePriceChange('min', value)}
                    placeholder="R$ 0,00"
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxPrice" className="text-xs">
                    Máximo
                  </Label>
                  <CurrencyInput
                    value={maxPrice}
                    onChange={(value) => handlePriceChange('max', value)}
                    placeholder="R$ 10.000,00"
                    className="h-9"
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export { EquipmentFiltersClient };
