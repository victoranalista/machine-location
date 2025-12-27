'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loader2, ShieldCheck, CreditCard, Truck } from 'lucide-react';
import { differenceInDays } from 'date-fns';
import { createRental } from '../actions';
import { toast } from 'sonner';

type CartItem = {
  id: string;
  equipmentId: string;
  startDate: Date;
  endDate: Date;
  equipment: {
    id: string;
    name: string;
    dailyRate: number;
    weeklyRate: number | null;
    monthlyRate: number | null;
  };
};

type CartSummaryProps = {
  items: CartItem[];
  isLoggedIn: boolean;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    value
  );

const calculateItemTotal = (item: CartItem) => {
  const days =
    differenceInDays(new Date(item.endDate), new Date(item.startDate)) + 1;
  if (item.equipment.monthlyRate && days >= 30)
    return (item.equipment.monthlyRate / 30) * days;
  if (item.equipment.weeklyRate && days >= 7)
    return (item.equipment.weeklyRate / 7) * days;
  return item.equipment.dailyRate * days;
};

const CartSummary = ({ items, isLoggedIn }: CartSummaryProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const subtotal = items.reduce(
    (sum, item) => sum + calculateItemTotal(item),
    0
  );
  const protectionFee = subtotal * 0.05;
  const total = subtotal + protectionFee;
  const handleCheckout = () => {
    if (!isLoggedIn) {
      router.push('/login?callbackUrl=/carrinho');
      return;
    }
    startTransition(async () => {
      for (const item of items) {
        const result = await createRental({
          equipmentId: item.equipmentId,
          startDate: new Date(item.startDate),
          endDate: new Date(item.endDate)
        });
        if (result.success) {
          toast.success(`Reserva ${result.rentalNumber} criada com sucesso!`);
        }
      }
      router.push('/minha-conta/locacoes');
    });
  };
  return (
    <Card className="sticky top-20 h-fit">
      <CardHeader>
        <CardTitle>Resumo do Pedido</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          {items.map((item) => {
            const days =
              differenceInDays(
                new Date(item.endDate),
                new Date(item.startDate)
              ) + 1;
            return (
              <div key={item.id} className="flex justify-between">
                <span className="truncate pr-2">
                  {item.equipment.name} ({days}d)
                </span>
                <span>{formatCurrency(calculateItemTotal(item))}</span>
              </div>
            );
          })}
        </div>
        <Separator />
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Taxa de proteção (5%)</span>
            <span>{formatCurrency(protectionFee)}</span>
          </div>
          <div className="flex justify-between">
            <span>Entrega</span>
            <span className="text-primary">A combinar</span>
          </div>
        </div>
        <Separator />
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span className="text-xl">{formatCurrency(total)}</span>
        </div>
        <Button
          className="w-full"
          size="lg"
          onClick={handleCheckout}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <CreditCard className="mr-2 h-4 w-4" />
              {isLoggedIn ? 'Finalizar Reserva' : 'Entrar para Finalizar'}
            </>
          )}
        </Button>
        <Separator />
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span>Proteção contra danos incluída</span>
          </div>
          <div className="flex items-center gap-3">
            <Truck className="h-5 w-5 text-primary" />
            <span>Entrega e retirada disponível</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { CartSummary };
