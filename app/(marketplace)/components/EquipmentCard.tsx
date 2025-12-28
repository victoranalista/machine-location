import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';
import { EquipmentCard } from '../actions';
import { formatCurrency } from '@/lib/validators';

type EquipmentCardProps = {
  equipment: EquipmentCard;
};

const EquipmentCardComponent = ({ equipment }: EquipmentCardProps) => (
  <Link href={`/equipamentos/${equipment.slug}`}>
    <Card className="group h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {equipment.mainImageUrl ? (
          <Image
            src={equipment.mainImageUrl}
            alt={equipment.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <span className="text-sm text-muted-foreground">Sem imagem</span>
          </div>
        )}
        {equipment.featured && (
          <Badge className="absolute left-3 top-3 shadow-lg">Destaque</Badge>
        )}
      </div>
      <CardContent className="p-4">
        <div className="mb-2 flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {equipment.category.name}
          </Badge>
          {equipment.brand && (
            <span className="text-xs text-muted-foreground">
              {equipment.brand.name}
            </span>
          )}
        </div>
        <h3 className="mb-2 line-clamp-2 font-semibold leading-tight transition-colors group-hover:text-primary">
          {equipment.name}
        </h3>
        {equipment.shortDescription && (
          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
            {equipment.shortDescription}
          </p>
        )}
        {(equipment.city || equipment.state) && (
          <div className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span>
              {[equipment.city, equipment.state].filter(Boolean).join(', ')}
            </span>
          </div>
        )}
        <div className="flex items-end justify-between border-t pt-3">
          <div>
            <p className="text-lg font-bold">
              {formatCurrency(equipment.dailyRate)}
            </p>
            <p className="text-xs text-muted-foreground">/dia</p>
          </div>
          {equipment.weeklyRate && (
            <div className="text-right">
              <p className="text-sm font-medium">
                {formatCurrency(equipment.weeklyRate)}
              </p>
              <p className="text-xs text-muted-foreground">/semana</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  </Link>
);

export { EquipmentCardComponent };
