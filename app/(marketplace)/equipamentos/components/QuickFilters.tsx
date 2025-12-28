'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { categories, brands } from '../data/equipment-data';

const QuickFilters = () => (
  <div className="space-y-6">
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Categorias Populares</h2>
        <Badge variant="outline">{categories.length} categorias</Badge>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category, index) => (
          <Link
            key={category.slug}
            href={`/equipamentos?categoria=${category.slug}`}
            className="animate-in fade-in zoom-in-95 duration-500"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardContent className="p-4">
                <h3 className="mb-1 font-semibold transition-colors group-hover:text-primary">
                  {category.name}
                </h3>
                <p className="line-clamp-2 text-xs text-muted-foreground">
                  {category.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Marcas Disponíveis</h2>
        <Badge variant="outline">{brands.length} marcas</Badge>
      </div>
      <div className="flex flex-wrap gap-2">
        {brands.map((brand, index) => (
          <Link
            key={brand.slug}
            href={`/equipamentos?marca=${brand.slug}`}
            className="animate-in fade-in duration-500"
            style={{ animationDelay: `${index * 20}ms` }}
          >
            <Badge
              variant="secondary"
              className="cursor-pointer transition-all hover:scale-105 hover:shadow-md"
            >
              {brand.name}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  </div>
);

export { QuickFilters };
