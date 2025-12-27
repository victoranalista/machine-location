'use client';

import { useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, MapPin, Trash2, Loader2 } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { removeFromCart } from '../actions';
import { toast } from 'sonner';

type CartItem = {
  id: string;
  equipmentId: string;
  startDate: Date;
  endDate: Date;
  equipment: {
    id: string;
    name: string;
    slug: string;
    mainImageUrl: string | null;
    dailyRate: number;
    weeklyRate: number | null;
    monthlyRate: number | null;
    brand: { name: string } | null;
    category: { name: string; slug: string };
    city: string | null;
    state: string | null;
  };
};

type CartClientProps = {
  items: CartItem[];
  isLoggedIn: boolean;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    value
  );

const CartItemCard = ({ item }: { item: CartItem }) => {
  const [isPending, startTransition] = useTransition();
  const days =
    differenceInDays(new Date(item.endDate), new Date(item.startDate)) + 1;
  const calculatePrice = () => {
    if (item.equipment.monthlyRate && days >= 30)
      return (item.equipment.monthlyRate / 30) * days;
    if (item.equipment.weeklyRate && days >= 7)
      return (item.equipment.weeklyRate / 7) * days;
    return item.equipment.dailyRate * days;
  };
  const handleRemove = () => {
    startTransition(async () => {
      const result = await removeFromCart(item.equipmentId);
      if (result.success) toast.success('Item removido do carrinho');
    });
  };
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Link
            href={`/equipamentos/${item.equipment.slug}`}
            className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted"
          >
            {item.equipment.mainImageUrl ? (
              <Image
                src={item.equipment.mainImageUrl}
                alt={item.equipment.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                Sem imagem
              </div>
            )}
          </Link>
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <Link
                  href={`/equipamentos/${item.equipment.slug}`}
                  className="font-semibold hover:text-primary"
                >
                  {item.equipment.name}
                </Link>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline" className="text-xs">
                    {item.equipment.category.name}
                  </Badge>
                  {item.equipment.brand && (
                    <span>{item.equipment.brand.name}</span>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4 text-destructive" />
                )}
              </Button>
            </div>
            {(item.equipment.city || item.equipment.state) && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                <span>
                  {[item.equipment.city, item.equipment.state]
                    .filter(Boolean)
                    .join(', ')}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                {format(new Date(item.startDate), 'dd/MM/yyyy', {
                  locale: ptBR
                })}{' '}
                -{' '}
                {format(new Date(item.endDate), 'dd/MM/yyyy', { locale: ptBR })}
              </span>
              <span className="text-xs">({days} dias)</span>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold">{formatCurrency(calculatePrice())}</p>
            <p className="text-sm text-muted-foreground">
              {formatCurrency(item.equipment.dailyRate)}/dia
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const CartClient = ({ items, isLoggedIn }: CartClientProps) => (
  <div className="space-y-4">
    {items.map((item) => (
      <CartItemCard key={item.id} item={item} />
    ))}
    {!isLoggedIn && (
      <>
        <Separator />
        <Card className="border-primary bg-primary/5">
          <CardContent className="p-4">
            <p className="text-sm">
              <Link
                href="/login?callbackUrl=/carrinho"
                className="font-medium text-primary hover:underline"
              >
                Faça login
              </Link>{' '}
              para finalizar sua reserva e ter acesso a benefícios exclusivos.
            </p>
          </CardContent>
        </Card>
      </>
    )}
  </div>
);

export { CartClient };
