'use client';

import { useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Package, Loader2, ShoppingCart } from 'lucide-react';
import { toggleFavorite } from '../../actions';
import { toast } from 'sonner';

type Favorite = {
  id: string;
  equipment: {
    id: string;
    name: string;
    slug: string;
    mainImageUrl: string | null;
    dailyRate: number;
    status: string;
    brand: { name: string } | null;
    category: { name: string; slug: string };
  };
};

type FavoritesClientProps = {
  favorites: Favorite[];
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    value
  );

const FavoriteCard = ({ favorite }: { favorite: Favorite }) => {
  const [isPending, startTransition] = useTransition();
  const { equipment } = favorite;

  const handleRemove = () => {
    startTransition(async () => {
      const result = await toggleFavorite(equipment.id);
      if (!result.favorited) toast.success('Removido dos favoritos');
    });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href={`/equipamentos/${equipment.slug}`}
            className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-lg bg-muted"
          >
            {equipment.mainImageUrl ? (
              <Image
                src={equipment.mainImageUrl}
                alt={equipment.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </Link>
          <div className="flex flex-1 flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Link
                    href={`/equipamentos/${equipment.slug}`}
                    className="font-semibold hover:text-primary"
                  >
                    {equipment.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {equipment.brand?.name} • {equipment.category.name}
                  </p>
                </div>
                <Badge
                  variant={
                    equipment.status === 'AVAILABLE' ? 'default' : 'secondary'
                  }
                >
                  {equipment.status === 'AVAILABLE'
                    ? 'Disponível'
                    : 'Indisponível'}
                </Badge>
              </div>
              <p className="mt-2 text-lg font-bold text-primary">
                {formatCurrency(equipment.dailyRate)}
                <span className="text-sm font-normal text-muted-foreground">
                  /dia
                </span>
              </p>
            </div>
            <div className="mt-4 flex gap-2">
              <Link href={`/equipamentos/${equipment.slug}`}>
                <Button size="sm" disabled={equipment.status !== 'AVAILABLE'}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Alugar
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemove}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Heart className="mr-1 h-4 w-4 fill-current text-red-500" />
                )}
                Remover
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const FavoritesClient = ({ favorites }: FavoritesClientProps) => {
  if (favorites.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Heart className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-lg font-medium">Nenhum favorito ainda</p>
          <p className="text-sm text-muted-foreground">
            Salve equipamentos para alugar depois
          </p>
          <Link href="/equipamentos" className="mt-4">
            <Button>Explorar Equipamentos</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {favorites.map((favorite) => (
        <FavoriteCard key={favorite.id} favorite={favorite} />
      ))}
    </div>
  );
};

export { FavoritesClient };
