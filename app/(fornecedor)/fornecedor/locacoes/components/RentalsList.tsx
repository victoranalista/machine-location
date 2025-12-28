'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { getSupplierRentals } from '../../actions';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type Rental = {
  id: string;
  startDate: Date;
  endDate: Date;
  total: number;
  status: string;
  paymentStatus: string;
  user: { name: string; email: string };
  equipment: { name: string };
};

export const RentalsList = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadRentals = async () => {
      try {
        const data = await getSupplierRentals();
        setRentals(data.rentals);
      } finally {
        setLoading(false);
      }
    };
    loadRentals();
  }, []);
  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      'default' | 'secondary' | 'outline' | 'destructive'
    > = {
      PENDING: 'outline',
      CONFIRMED: 'default',
      IN_PROGRESS: 'secondary',
      COMPLETED: 'default',
      CANCELLED: 'destructive'
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };
  const getPaymentBadge = (status: string) => {
    const variants: Record<
      string,
      'default' | 'secondary' | 'outline' | 'destructive'
    > = {
      PENDING: 'outline',
      PAID: 'default',
      REFUNDED: 'secondary',
      FAILED: 'destructive'
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };
  if (loading)
    return (
      <div className="flex items-center justify-center h-96">Carregando...</div>
    );
  if (rentals.length === 0)
    return (
      <Card className="p-12 text-center">
        <h3 className="text-lg font-semibold mb-2">Nenhuma locação recebida</h3>
        <p className="text-muted-foreground">
          Suas locações aparecerão aqui quando alguém alugar seus equipamentos
        </p>
      </Card>
    );
  return (
    <div className="grid gap-4">
      {rentals.map((rental) => (
        <Card key={rental.id} className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg">{rental.equipment.name}</h3>
              <p className="text-sm text-muted-foreground">
                Cliente: {rental.user.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {rental.user.email}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-xl">R$ {rental.total.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <p className="text-muted-foreground">
                {format(new Date(rental.startDate), "dd 'de' MMMM", {
                  locale: ptBR
                })}{' '}
                até{' '}
                {format(new Date(rental.endDate), "dd 'de' MMMM, yyyy", {
                  locale: ptBR
                })}
              </p>
            </div>
            <div className="flex gap-2">
              {getStatusBadge(rental.status)}
              {getPaymentBadge(rental.paymentStatus)}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
