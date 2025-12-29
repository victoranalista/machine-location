import { getSupplierRentals } from '../actions';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RentalActions } from './RentalActions';
import { Calendar, MapPin, User } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const statusConfig = {
  PENDING: { label: 'Pendente', variant: 'outline' as const },
  CONFIRMED: { label: 'Confirmada', variant: 'secondary' as const },
  IN_PROGRESS: { label: 'Em andamento', variant: 'default' as const },
  COMPLETED: { label: 'Concluída', variant: 'secondary' as const },
  CANCELLED: { label: 'Cancelada', variant: 'destructive' as const }
};

const paymentConfig = {
  PENDING: { label: 'Pendente', variant: 'outline' as const },
  PAID: { label: 'Pago', variant: 'default' as const },
  REFUNDED: { label: 'Reembolsado', variant: 'secondary' as const },
  FAILED: { label: 'Falhou', variant: 'destructive' as const }
};

export const RentalsList = async () => {
  const rentals = await getSupplierRentals();
  if (rentals.length === 0)
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <p className="mb-4 text-lg font-medium text-muted-foreground">
            Nenhuma locação encontrada
          </p>
          <p className="text-sm text-muted-foreground">
            Suas locações aparecerão aqui
          </p>
        </CardContent>
      </Card>
    );
  return (
    <div className="space-y-4">
      {rentals.map((rental) => (
        <Card
          key={rental.id}
          className="overflow-hidden transition-all hover:shadow-md"
        >
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <Avatar className="h-20 w-20 rounded-lg">
                <AvatarImage
                  src={rental.equipment.mainImageUrl ?? ''}
                  alt={rental.equipment.name}
                />
                <AvatarFallback className="rounded-lg">
                  {rental.equipment.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold">{rental.equipment.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      #{rental.rentalNumber}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={statusConfig[rental.status].variant}>
                      {statusConfig[rental.status].label}
                    </Badge>
                    <Badge
                      variant={paymentConfig[rental.paymentStatus].variant}
                    >
                      {paymentConfig[rental.paymentStatus].label}
                    </Badge>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{rental.user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {rental.user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        {format(new Date(rental.startDate), 'dd/MM/yyyy', {
                          locale: ptBR
                        })}{' '}
                        -{' '}
                        {format(new Date(rental.endDate), 'dd/MM/yyyy', {
                          locale: ptBR
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {rental.totalDays} dias
                      </p>
                    </div>
                  </div>
                  {rental.deliveryCity && rental.deliveryState && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {rental.deliveryCity}, {rental.deliveryState}
                        </p>
                        <p className="text-xs text-muted-foreground">Entrega</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between border-t pt-3">
                  <div>
                    <p className="text-2xl font-bold">
                      R${' '}
                      {rental.total.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2
                      })}
                    </p>
                    {rental.depositAmount && !rental.depositPaid && (
                      <p className="text-xs text-muted-foreground">
                        + R${' '}
                        {rental.depositAmount.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2
                        })}{' '}
                        de caução
                      </p>
                    )}
                  </div>
                  <RentalActions rental={rental} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
