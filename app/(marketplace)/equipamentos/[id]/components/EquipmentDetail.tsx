import { Badge } from '@/components/ui/badge';
import { MapPin, Star } from 'lucide-react';
import { EquipmentDetail as EquipmentDetailType } from '../actions';

type EquipmentDetailProps = {
  equipment: EquipmentDetailType;
};

const EquipmentDetail = ({ equipment }: EquipmentDetailProps) => (
  <div className="space-y-6">
    <div>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Badge variant="outline">{equipment.category.name}</Badge>
        {equipment.brand && (
          <Badge variant="secondary">{equipment.brand.name}</Badge>
        )}
        {equipment.model && (
          <span className="text-sm text-muted-foreground">
            {equipment.model}
          </span>
        )}
        {equipment.year && (
          <span className="text-sm text-muted-foreground">
            • {equipment.year}
          </span>
        )}
      </div>
      <h1 className="text-3xl font-bold tracking-tight">{equipment.name}</h1>
      {(equipment.city || equipment.state) && (
        <div className="mt-2 flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>
            {[equipment.city, equipment.state].filter(Boolean).join(', ')}
          </span>
        </div>
      )}
      {equipment.reviewCount > 0 && (
        <div className="mt-2 flex items-center gap-2">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < Math.round(equipment.averageRating) ? 'fill-primary text-primary' : 'text-muted'}`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {equipment.averageRating.toFixed(1)} ({equipment.reviewCount}{' '}
            avaliações)
          </span>
        </div>
      )}
    </div>
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <p className="whitespace-pre-wrap">{equipment.description}</p>
    </div>
    {equipment.features.length > 0 && (
      <div>
        <h3 className="mb-3 font-semibold">Recursos</h3>
        <div className="flex flex-wrap gap-2">
          {equipment.features.map((feature) => (
            <Badge key={feature} variant="outline">
              {feature}
            </Badge>
          ))}
        </div>
      </div>
    )}
  </div>
);

export { EquipmentDetail };
