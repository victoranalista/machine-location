import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { EquipmentDetail } from '../actions';
import { Gauge, Fuel, Weight, Maximize } from 'lucide-react';

type EquipmentSpecsProps = {
  specs: { id: string; name: string; value: string; unit: string | null }[];
  equipment: EquipmentDetail;
};

const formatWeight = (weight: number | null) =>
  weight ? `${weight.toLocaleString('pt-BR')} kg` : null;

const EquipmentSpecs = ({ specs, equipment }: EquipmentSpecsProps) => {
  const mainSpecs = [
    { icon: Gauge, label: 'Potência', value: equipment.enginePower },
    { icon: Fuel, label: 'Combustível', value: equipment.fuelType },
    {
      icon: Weight,
      label: 'Peso Operacional',
      value: formatWeight(equipment.operatingWeight)
    },
    { icon: Maximize, label: 'Dimensões', value: equipment.dimensions }
  ].filter((spec) => spec.value);
  const hasSpecs =
    mainSpecs.length > 0 || specs.length > 0 || equipment.capacity;
  if (!hasSpecs) return null;
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Especificações Técnicas</h2>
      {mainSpecs.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {mainSpecs.map((spec) => (
            <Card key={spec.label}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <spec.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{spec.label}</p>
                  <p className="font-semibold">{spec.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {equipment.capacity && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Capacidade</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{equipment.capacity}</p>
          </CardContent>
        </Card>
      )}
      {specs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Especificações Detalhadas</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                {specs.map((spec) => (
                  <TableRow key={spec.id}>
                    <TableCell className="font-medium">{spec.name}</TableCell>
                    <TableCell className="text-right">
                      {spec.value}{' '}
                      {spec.unit && (
                        <span className="text-muted-foreground">
                          {spec.unit}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export { EquipmentSpecs };
