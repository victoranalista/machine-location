'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Package, Loader2, X } from 'lucide-react';
import { cancelRental } from '../../actions';
import { toast } from 'sonner';
import { RentalStatus, PaymentStatus } from '@/prisma/generated/prisma/client';

type Rental = {
  id: string;
  rentalNumber: string;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  total: number;
  status: RentalStatus;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  equipment: {
    id: string;
    name: string;
    slug: string;
    mainImageUrl: string | null;
    brand: { name: string } | null;
    category: { name: string; slug: string };
  };
};

type RentalsClientProps = {
  rentals: Rental[];
  initialFilter?: string;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    value
  );

const statusConfig: Record<
  RentalStatus,
  {
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
  }
> = {
  PENDING: { label: 'Pendente', variant: 'secondary' },
  CONFIRMED: { label: 'Confirmada', variant: 'default' },
  IN_PROGRESS: { label: 'Em Andamento', variant: 'default' },
  COMPLETED: { label: 'Concluída', variant: 'outline' },
  CANCELLED: { label: 'Cancelada', variant: 'destructive' }
};

const RentalCard = ({ rental }: { rental: Rental }) => {
  const [isPending, startTransition] = useTransition();
  const status = statusConfig[rental.status];
  const canCancel = ['PENDING', 'CONFIRMED'].includes(rental.status);
  const handleCancel = () => {
    startTransition(async () => {
      const result = await cancelRental(rental.id);
      if (result.success) toast.success('Locação cancelada com sucesso');
    });
  };
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href={`/equipamentos/${rental.equipment.slug}`}
            className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted"
          >
            {rental.equipment.mainImageUrl ? (
              <Image
                src={rental.equipment.mainImageUrl}
                alt={rental.equipment.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </Link>
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <Link
                  href={`/equipamentos/${rental.equipment.slug}`}
                  className="font-semibold hover:text-primary"
                >
                  {rental.equipment.name}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {rental.rentalNumber}
                </p>
              </div>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {format(new Date(rental.startDate), 'dd/MM/yyyy', {
                  locale: ptBR
                })}{' '}
                -{' '}
                {format(new Date(rental.endDate), 'dd/MM/yyyy', {
                  locale: ptBR
                })}
              </span>
              <span>({rental.totalDays} dias)</span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold">{formatCurrency(rental.total)}</p>
              <div className="flex gap-2">
                {canCancel && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" disabled={isPending}>
                        {isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <X className="mr-1 h-4 w-4" />
                        )}
                        Cancelar
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancelar Locação</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja cancelar esta locação? Esta
                          ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Não, manter</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCancel}>
                          Sim, cancelar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const RentalsClient = ({ rentals, initialFilter }: RentalsClientProps) => {
  const [filter, setFilter] = useState(initialFilter ?? 'all');
  const filteredRentals = rentals.filter((r) => {
    if (filter === 'all') return true;
    if (filter === 'active')
      return ['CONFIRMED', 'IN_PROGRESS'].includes(r.status);
    if (filter === 'pending') return r.status === 'PENDING';
    if (filter === 'completed') return r.status === 'COMPLETED';
    if (filter === 'cancelled') return r.status === 'CANCELLED';
    return true;
  });
  return (
    <Tabs value={filter} onValueChange={setFilter}>
      <TabsList>
        <TabsTrigger value="all">Todas ({rentals.length})</TabsTrigger>
        <TabsTrigger value="active">
          Ativas (
          {
            rentals.filter((r) =>
              ['CONFIRMED', 'IN_PROGRESS'].includes(r.status)
            ).length
          }
          )
        </TabsTrigger>
        <TabsTrigger value="pending">
          Pendentes ({rentals.filter((r) => r.status === 'PENDING').length})
        </TabsTrigger>
        <TabsTrigger value="completed">
          Concluídas ({rentals.filter((r) => r.status === 'COMPLETED').length})
        </TabsTrigger>
      </TabsList>
      <TabsContent value={filter} className="mt-6 space-y-4">
        {filteredRentals.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Package className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium">Nenhuma locação encontrada</p>
              <p className="text-sm text-muted-foreground">
                Você ainda não possui locações nesta categoria
              </p>
              <Link href="/equipamentos" className="mt-4">
                <Button>Explorar Equipamentos</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          filteredRentals.map((rental) => (
            <RentalCard key={rental.id} rental={rental} />
          ))
        )}
      </TabsContent>
    </Tabs>
  );
};

export { RentalsClient };
