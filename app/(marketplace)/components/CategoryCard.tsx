import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { CategoryWithCount } from '../actions';
import {
  Truck,
  HardHat,
  Construction,
  Forklift,
  Cog,
  Container,
  Tractor,
  Crane
} from 'lucide-react';

type CategoryCardProps = {
  category: CategoryWithCount;
};

const categoryIcons: Record<string, React.ElementType> = {
  escavadeiras: Construction,
  retroescavadeiras: Truck,
  tratores: Tractor,
  guindastes: Crane,
  empilhadeiras: Forklift,
  'plataformas-elevatorias': HardHat,
  compactadores: Cog,
  geradores: Container
};

const CategoryCard = ({ category }: CategoryCardProps) => {
  const IconComponent = categoryIcons[category.slug] || Truck;
  return (
    <Link href={`/equipamentos?categoria=${category.slug}`}>
      <Card className="group h-full overflow-hidden transition-all hover:border-primary hover:shadow-lg">
        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
          {category.imageUrl ? (
            <Image
              src={category.imageUrl}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-muted">
              <IconComponent className="h-12 w-12 text-muted-foreground/50" />
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold group-hover:text-primary">
                {category.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {category.equipmentCount} equipamentos
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <IconComponent className="h-5 w-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export { CategoryCard };
