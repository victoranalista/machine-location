import { getEquipmentPerformance } from '../actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TrendingUp } from 'lucide-react';

export const EquipmentPerformance = async () => {
  const equipment = await getEquipmentPerformance();
  if (equipment.length === 0)
    return (
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Top Equipamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground">
            Nenhum equipamento com locações
          </p>
        </CardContent>
      </Card>
    );
  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle>Top Equipamentos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {equipment.map((eq, index) => (
            <div key={eq.id} className="flex items-center gap-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-bold">
                {index + 1}
              </div>
              <Avatar className="h-10 w-10 rounded-md">
                <AvatarImage src={eq.mainImageUrl ?? ''} alt={eq.name} />
                <AvatarFallback className="rounded-md">
                  {eq.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">{eq.name}</p>
                <p className="text-xs text-muted-foreground">
                  {eq.totalRentals} locações
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  R${' '}
                  {eq.totalRevenue.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
