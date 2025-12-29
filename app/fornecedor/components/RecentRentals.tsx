import { getRecentRentals } from '../actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const statusConfig = {
  PENDING: { label: 'Pendente', variant: 'outline' as const },
  CONFIRMED: { label: 'Confirmada', variant: 'secondary' as const },
  IN_PROGRESS: { label: 'Em andamento', variant: 'default' as const },
  COMPLETED: { label: 'Concluída', variant: 'secondary' as const },
  CANCELLED: { label: 'Cancelada', variant: 'destructive' as const }
};

export const RecentRentals = async () => {
  const rentals = await getRecentRentals();
  if (rentals.length === 0)
    return (
      <Card>
        <CardHeader>
          <CardTitle>Locações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground">
            Nenhuma locação encontrada
          </p>
        </CardContent>
      </Card>
    );
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Locações Recentes</CardTitle>
        <Link href="/fornecedor/locacoes">
          <Button variant="ghost" size="sm">
            Ver todas
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rentals.map((rental) => (
            <div
              key={rental.id}
              className="flex items-center gap-4 rounded-lg border p-4 transition-all hover:shadow-sm"
            >
              <Avatar className="h-12 w-12 rounded-lg">
                <AvatarImage
                  src={rental.equipment.mainImageUrl ?? ''}
                  alt={rental.equipment.name}
                />
                <AvatarFallback className="rounded-lg">
                  {rental.equipment.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{rental.equipment.name}</p>
                  <Badge variant={statusConfig[rental.status].variant}>
                    {statusConfig[rental.status].label}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {rental.user.name} • #{rental.rentalNumber}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(rental.createdAt), {
                    addSuffix: true,
                    locale: ptBR
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  R${' '}
                  {rental.total.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2
                  })}
                </p>
                <p className="text-xs text-muted-foreground">
                  {Math.ceil(
                    (new Date(rental.endDate).getTime() -
                      new Date(rental.startDate).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{' '}
                  dias
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
