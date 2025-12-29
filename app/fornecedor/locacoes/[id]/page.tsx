import { notFound } from 'next/navigation';
import { getRentalDetails } from '../actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Calendar,
  MapPin,
  User,
  Phone,
  Mail,
  Building,
  FileText,
  DollarSign,
  Package
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { RentalActions } from '../components/RentalActions';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

type RentalDetailsPageProps = {
  params: { id: string };
};

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

const RentalDetailsPage = async ({ params }: RentalDetailsPageProps) => {
  const { id } = await params;
  try {
    const rental = await getRentalDetails(id);
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/fornecedor/locacoes">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Locação #{rental.rentalNumber}
              </h1>
              <p className="text-muted-foreground">Detalhes da locação</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant={statusConfig[rental.status].variant}>
              {statusConfig[rental.status].label}
            </Badge>
            <Badge variant={paymentConfig[rental.paymentStatus].variant}>
              {paymentConfig[rental.paymentStatus].label}
            </Badge>
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Equipamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <Avatar className="h-24 w-24 rounded-lg">
                  <AvatarImage
                    src={rental.equipment.mainImageUrl ?? ''}
                    alt={rental.equipment.name}
                  />
                  <AvatarFallback className="rounded-lg">
                    {rental.equipment.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <h3 className="text-xl font-semibold">
                    {rental.equipment.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {rental.equipment.category.name}
                    {rental.equipment.brand &&
                      ` • ${rental.equipment.brand.name}`}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {format(new Date(rental.startDate), 'dd/MM/yyyy', {
                          locale: ptBR
                        })}{' '}
                        -{' '}
                        {format(new Date(rental.endDate), 'dd/MM/yyyy', {
                          locale: ptBR
                        })}
                      </span>
                    </div>
                    <span className="text-muted-foreground">•</span>
                    <span>{rental.totalDays} dias</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Valores
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">
                  R${' '}
                  {rental.subtotal.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2
                  })}
                </span>
              </div>
              {rental.deliveryFee !== null && rental.deliveryFee > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Entrega</span>
                  <span className="font-medium">
                    R${' '}
                    {rental.deliveryFee.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2
                    })}
                  </span>
                </div>
              )}
              {rental.insuranceFee !== null && rental.insuranceFee > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Seguro</span>
                  <span className="font-medium">
                    R${' '}
                    {rental.insuranceFee.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2
                    })}
                  </span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-2xl font-bold text-primary">
                  R${' '}
                  {rental.total.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2
                  })}
                </span>
              </div>
              {rental.depositAmount && (
                <>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Caução</span>
                    <span className="font-medium">
                      R${' '}
                      {rental.depositAmount.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2
                      })}
                    </span>
                  </div>
                  <Badge variant={rental.depositPaid ? 'default' : 'outline'}>
                    {rental.depositPaid ? 'Paga' : 'Pendente'}
                  </Badge>
                </>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{rental.user.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{rental.user.email}</span>
                </div>
                {rental.user.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{rental.user.phone}</span>
                  </div>
                )}
                {rental.user.company && (
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>{rental.user.company}</span>
                  </div>
                )}
                {rental.user.document && (
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{rental.user.document}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Entrega
              </CardTitle>
            </CardHeader>
            <CardContent>
              {rental.deliveryAddress ? (
                <div className="space-y-1 text-sm">
                  <p>{rental.deliveryAddress}</p>
                  <p>
                    {rental.deliveryCity}, {rental.deliveryState}
                  </p>
                  {rental.deliveryZip && <p>CEP: {rental.deliveryZip}</p>}
                  {rental.deliveryNotes && (
                    <>
                      <Separator className="my-2" />
                      <p className="text-muted-foreground">
                        {rental.deliveryNotes}
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Sem informações de entrega
                </p>
              )}
            </CardContent>
          </Card>
        </div>
        {rental.notes && (
          <Card>
            <CardHeader>
              <CardTitle>Observações</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{rental.notes}</p>
            </CardContent>
          </Card>
        )}
        {rental.cancelReason && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">
                Motivo do Cancelamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{rental.cancelReason}</p>
            </CardContent>
          </Card>
        )}
        <div className="flex justify-end">
          <RentalActions rental={rental} />
        </div>
      </div>
    );
  } catch {
    notFound();
  }
};

export default RentalDetailsPage;
