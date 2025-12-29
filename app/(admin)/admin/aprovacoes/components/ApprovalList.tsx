'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';
import {
  getAdminEquipmentList,
  approveEquipment,
  rejectEquipment
} from '../../actions';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type Equipment = {
  id: string;
  name: string;
  dailyRate: number;
  category: { name: string };
  owner: { name: string | null; email: string };
  createdAt: Date;
};

export const ApprovalList = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const loadData = async () => {
      const data = await getAdminEquipmentList(1, 50, undefined, 'pending');
      // Convert Decimal to number
      const processedData = data.equipment.map(
        (
          item: { dailyRate: { toNumber: () => number } } & Omit<
            Equipment,
            'dailyRate'
          >
        ) => ({
          ...item,
          dailyRate:
            typeof item.dailyRate === 'object' && 'toNumber' in item.dailyRate
              ? item.dailyRate.toNumber()
              : item.dailyRate
        })
      );
      setEquipment(processedData);
      setLoading(false);
    };
    loadData();
  }, []);
  const handleApprove = async (id: string, name: string) => {
    if (!confirm(`Aprovar equipamento: ${name}?`)) return;
    try {
      await approveEquipment(id);
      setEquipment((prev) => prev.filter((e) => e.id !== id));
      toast.success('Equipamento aprovado');
      router.refresh();
    } catch {
      toast.error('Erro ao aprovar');
    }
  };
  const handleReject = async (id: string, name: string) => {
    if (!confirm(`Reprovar equipamento: ${name}?`)) return;
    try {
      await rejectEquipment(id);
      setEquipment((prev) => prev.filter((e) => e.id !== id));
      toast.success('Equipamento reprovado');
      router.refresh();
    } catch {
      toast.error('Erro ao reprovar');
    }
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">Carregando...</div>
    );
  }
  if (equipment.length === 0) {
    return (
      <Card className="p-12 text-center">
        <h3 className="text-lg font-semibold mb-2">
          Nenhum equipamento pendente
        </h3>
        <p className="text-muted-foreground">
          Todos os equipamentos foram aprovados ou reprovados
        </p>
      </Card>
    );
  }
  return (
    <div className="grid gap-4">
      {equipment.map((item) => (
        <Card key={item.id} className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div>
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.category.name}
                </p>
              </div>
              <div className="text-sm">
                <p className="text-muted-foreground">
                  Fornecedor: {item.owner?.name || 'N/A'}
                </p>
                <p className="text-muted-foreground">
                  Email: {item.owner?.email || 'N/A'}
                </p>
              </div>
              <p className="font-medium">R$ {item.dailyRate.toFixed(2)}/dia</p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="default"
                onClick={() => handleApprove(item.id, item.name)}
                className="gap-1"
              >
                <CheckCircle className="h-4 w-4" />
                Aprovar
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleReject(item.id, item.name)}
                className="gap-1"
              >
                <XCircle className="h-4 w-4" />
                Reprovar
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
