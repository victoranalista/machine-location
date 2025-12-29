import { EquipmentCardComponent } from '../../../components/EquipmentCard';
import { EquipmentCard } from '../../../actions';

type RelatedEquipmentProps = {
  equipment: EquipmentCard[];
};

const RelatedEquipment = ({ equipment }: RelatedEquipmentProps) => (
  <section>
    <h2 className="mb-6 text-2xl font-bold">Equipamentos Relacionados</h2>
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {equipment.map((eq) => (
        <EquipmentCardComponent key={eq.id} equipment={eq} />
      ))}
    </div>
  </section>
);

export { RelatedEquipment };
