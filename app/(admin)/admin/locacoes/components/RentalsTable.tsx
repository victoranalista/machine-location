'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  MoreHorizontal,
  Eye,
  Package,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  Loader2
} from 'lucide-react';
import { updateRentalStatus, updatePaymentStatus } from '../../actions';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type Rental = {
  id: string;
  rentalNumber: string;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  total: { toNumber: () => number };
  status: string;
  paymentStatus: string;
  createdAt: Date;
  user: { name: string | null; email: string; phone: string | null };
  equipment: { name: string; slug: string; mainImageUrl: string | null };
};

type RentalsTableProps = {
  data: {
    rentals: Rental[];
    total: number;
    totalPages: number;
  };
  page: number;
  status: string;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    value
  );

const statusConfig: Record<
  string,
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

const paymentConfig: Record<
  string,
  {
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
  }
> = {
  PENDING: { label: 'Aguardando', variant: 'secondary' },
  PAID: { label: 'Pago', variant: 'default' },
  FAILED: { label: 'Falhou', variant: 'destructive' },
  REFUNDED: { label: 'Reembolsado', variant: 'outline' }
};

const RentalsTable = ({ data, page, status }: RentalsTableProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (
    id: string,
    newStatus:
      | 'PENDING'
      | 'CONFIRMED'
      | 'IN_PROGRESS'
      | 'COMPLETED'
      | 'CANCELLED'
  ) => {
    startTransition(async () => {
      await updateRentalStatus(id, newStatus);
      toast.success('Status atualizado');
      router.refresh();
    });
  };

  const handlePaymentChange = (
    id: string,
    newStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
  ) => {
    startTransition(async () => {
      await updatePaymentStatus(id, newStatus);
      toast.success('Status de pagamento atualizado');
      router.refresh();
    });
  };

  const handleFilterChange = (value: string) => {
    const params = new URLSearchParams();
    if (value !== 'all') params.set('status', value);
    router.push(`/admin/locacoes?${params.toString()}`);
  };

  const buildPageUrl = (newPage: number) => {
    const params = new URLSearchParams();
    if (status !== 'all') params.set('status', status);
    params.set('page', newPage.toString());
    return `/admin/locacoes?${params.toString()}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Select value={status} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="PENDING">Pendentes</SelectItem>
            <SelectItem value="CONFIRMED">Confirmadas</SelectItem>
            <SelectItem value="IN_PROGRESS">Em Andamento</SelectItem>
            <SelectItem value="COMPLETED">Concluídas</SelectItem>
            <SelectItem value="CANCELLED">Canceladas</SelectItem>
          </SelectContent>
        </Select>
        {isPending && (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12" />
              <TableHead>Locação</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Período</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Pagamento</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.rentals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-32 text-center">
                  Nenhuma locação encontrada
                </TableCell>
              </TableRow>
            ) : (
              data.rentals.map((rental) => {
                const rentalStatus = statusConfig[rental.status];
                const paymentStatus = paymentConfig[rental.paymentStatus];
                return (
                  <TableRow key={rental.id}>
                    <TableCell>
                      <div className="relative h-10 w-10 overflow-hidden rounded bg-muted">
                        {rental.equipment.mainImageUrl ? (
                          <Image
                            src={rental.equipment.mainImageUrl}
                            alt={rental.equipment.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Package className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{rental.equipment.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {rental.rentalNumber}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {rental.user.name ?? rental.user.email}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {rental.user.phone ?? '-'}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>
                          {format(new Date(rental.startDate), 'dd/MM/yy', {
                            locale: ptBR
                          })}{' '}
                          -{' '}
                          {format(new Date(rental.endDate), 'dd/MM/yy', {
                            locale: ptBR
                          })}
                        </p>
                        <p className="text-muted-foreground">
                          {rental.totalDays} dias
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(rental.total.toNumber())}
                    </TableCell>
                    <TableCell>
                      <Badge variant={rentalStatus?.variant ?? 'outline'}>
                        {rentalStatus?.label ?? rental.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={paymentStatus?.variant ?? 'outline'}>
                        {paymentStatus?.label ?? rental.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={isPending}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/equipamentos/${rental.equipment.slug}`}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Ver Equipamento
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(rental.id, 'CONFIRMED')
                            }
                          >
                            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                            Confirmar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(rental.id, 'IN_PROGRESS')
                            }
                          >
                            <Clock className="mr-2 h-4 w-4 text-blue-500" />
                            Iniciar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(rental.id, 'COMPLETED')
                            }
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Concluir
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(rental.id, 'CANCELLED')
                            }
                            className="text-destructive"
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Cancelar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              handlePaymentChange(rental.id, 'PAID')
                            }
                          >
                            Marcar como Pago
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {data.rentals.length} de {data.total} locações
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              asChild={page > 1}
            >
              {page > 1 ? (
                <Link href={buildPageUrl(page - 1)}>
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Anterior
                </Link>
              ) : (
                <>
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Anterior
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= data.totalPages}
              asChild={page < data.totalPages}
            >
              {page < data.totalPages ? (
                <Link href={buildPageUrl(page + 1)}>
                  Próxima
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              ) : (
                <>
                  Próxima
                  <ChevronRight className="ml-1 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export { RentalsTable };
