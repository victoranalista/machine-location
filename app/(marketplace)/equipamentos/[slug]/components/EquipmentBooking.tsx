'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { format, differenceInDays, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  CalendarIcon,
  ShieldCheck,
  Truck,
  Clock,
  Loader2,
  ShoppingCart
} from 'lucide-react';
import { EquipmentDetail } from '../actions';
import { addToCart } from '../../../carrinho/actions';
import { toast } from 'sonner';
import { DateRange } from 'react-day-picker';

type EquipmentBookingProps = {
  equipment: EquipmentDetail;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    value
  );

const EquipmentBooking = ({ equipment }: EquipmentBookingProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), 1),
    to: addDays(new Date(), 7)
  });
  const days =
    dateRange?.from && dateRange?.to
      ? differenceInDays(dateRange.to, dateRange.from) + 1
      : 0;
  const calculatePrice = () => {
    if (!days) return { rate: equipment.dailyRate, type: 'dia', total: 0 };
    if (equipment.monthlyRate && days >= 30) {
      return {
        rate: equipment.monthlyRate / 30,
        type: 'dia (mensal)',
        total: (equipment.monthlyRate / 30) * days
      };
    }
    if (equipment.weeklyRate && days >= 7) {
      return {
        rate: equipment.weeklyRate / 7,
        type: 'dia (semanal)',
        total: (equipment.weeklyRate / 7) * days
      };
    }
    return {
      rate: equipment.dailyRate,
      type: 'dia',
      total: equipment.dailyRate * days
    };
  };
  const pricing = calculatePrice();
  const handleAddToCart = () => {
    if (!dateRange?.from || !dateRange?.to) {
      toast.error('Selecione as datas de locação');
      return;
    }
    startTransition(async () => {
      const result = await addToCart({
        equipmentId: equipment.id,
        startDate: dateRange.from!,
        endDate: dateRange.to!
      });
      if (result.success) {
        toast.success('Equipamento adicionado ao carrinho');
        router.push('/carrinho');
      }
    });
  };
  const handleBookNow = () => {
    if (!session) {
      router.push(`/login?callbackUrl=/equipamentos/${equipment.slug}`);
      return;
    }
    handleAddToCart();
  };
  const disabledDays = { before: new Date() };
  return (
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle className="flex items-baseline justify-between">
          <span className="text-3xl font-bold">
            {formatCurrency(pricing.rate)}
          </span>
          <span className="text-base font-normal text-muted-foreground">
            /{pricing.type}
          </span>
        </CardTitle>
        {equipment.weeklyRate && (
          <p className="text-sm text-muted-foreground">
            Semanal: {formatCurrency(equipment.weeklyRate)} • Mensal:{' '}
            {formatCurrency(equipment.monthlyRate ?? 0)}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Período de Locação</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !dateRange && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, 'dd/MM/yyyy', { locale: ptBR })} -{' '}
                      {format(dateRange.to, 'dd/MM/yyyy', { locale: ptBR })}
                    </>
                  ) : (
                    format(dateRange.from, 'dd/MM/yyyy', { locale: ptBR })
                  )
                ) : (
                  <span>Selecione as datas</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
                disabled={disabledDays}
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>
        </div>
        {days > 0 && (
          <>
            <Separator />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>
                  {formatCurrency(pricing.rate)} x {days} dias
                </span>
                <span>{formatCurrency(pricing.total)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxa de proteção (5%)</span>
                <span>{formatCurrency(pricing.total * 0.05)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatCurrency(pricing.total * 1.05)}</span>
              </div>
            </div>
          </>
        )}
        <div className="space-y-2 pt-2">
          <Button
            className="w-full"
            size="lg"
            onClick={handleBookNow}
            disabled={isPending || days < equipment.minRentalDays}
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ShoppingCart className="mr-2 h-4 w-4" />
            )}
            {isPending ? 'Adicionando...' : 'Adicionar ao Carrinho'}
          </Button>
          {equipment.minRentalDays > 1 && days < equipment.minRentalDays && (
            <p className="text-center text-sm text-destructive">
              Mínimo de {equipment.minRentalDays} dias de locação
            </p>
          )}
        </div>
        {equipment.depositAmount && (
          <p className="text-center text-sm text-muted-foreground">
            Caução requerida: {formatCurrency(equipment.depositAmount)}
          </p>
        )}
        <Separator />
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span>Proteção contra danos incluída</span>
          </div>
          <div className="flex items-center gap-3">
            <Truck className="h-5 w-5 text-primary" />
            <span>Entrega e retirada disponível</span>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-primary" />
            <span>Suporte técnico 24/7</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { EquipmentBooking };
