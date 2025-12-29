import { getSupplierEquipment } from '../actions';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EquipmentActions } from './EquipmentActions';
import { Calendar, MapPin } from 'lucide-react';

const statusConfig = {
  AVAILABLE: { label: 'Disponível', variant: 'default' as const },
  RENTED: { label: 'Alugado', variant: 'secondary' as const },
  MAINTENANCE: { label: 'Manutenção', variant: 'outline' as const },
  UNAVAILABLE: { label: 'Indisponível', variant: 'destructive' as const }
};

export const EquipmentList = async () => {
  const equipment = await getSupplierEquipment();
  if (equipment.length === 0)
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <p className="mb-4 text-lg font-medium text-muted-foreground">
            Nenhum equipamento cadastrado
          </p>
          <p className="text-sm text-muted-foreground">
            Comece adicionando seu primeiro equipamento
          </p>
        </CardContent>
      </Card>
    );
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {equipment.map((eq) => (
        <Card
          key={eq.id}
          className="group overflow-hidden transition-all hover:shadow-lg"
        >
          <div className="relative aspect-video overflow-hidden bg-muted">
            {eq.mainImageUrl ? (
              <img
                src={eq.mainImageUrl}
                alt={eq.name}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="text-2xl">
                    {eq.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
            <div className="absolute right-2 top-2 flex gap-2">
              <Badge variant={statusConfig[eq.status].variant}>
                {statusConfig[eq.status].label}
              </Badge>
              {!eq.isApproved && (
                <Badge variant="outline" className="bg-background/80">
                  Aguardando aprovação
                </Badge>
              )}
            </div>
          </div>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold line-clamp-1">{eq.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {eq.category.name}
                  {eq.brand && ` • ${eq.brand.name}`}
                </p>
              </div>
              {eq.shortDescription && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {eq.shortDescription}
                </p>
              )}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {eq.city && eq.state && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {eq.city}, {eq.state}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {eq.totalRentals} locações
                </div>
              </div>
              <div className="flex items-end justify-between border-t pt-3">
                <div>
                  <p className="text-xs text-muted-foreground">A partir de</p>
                  <p className="text-lg font-bold">
                    R${' '}
                    {eq.dailyRate.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2
                    })}
                    <span className="text-sm font-normal text-muted-foreground">
                      /dia
                    </span>
                  </p>
                </div>
                <EquipmentActions equipment={eq} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
