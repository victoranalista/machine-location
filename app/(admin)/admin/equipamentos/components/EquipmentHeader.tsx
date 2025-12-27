'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createEquipment } from '../../actions';
import { toast } from 'sonner';

type Category = { id: string; name: string };
type Brand = { id: string; name: string };

type EquipmentHeaderProps = {
  categories?: Category[];
  brands?: Brand[];
};

const EquipmentHeader = ({
  categories = [],
  brands = []
}: EquipmentHeaderProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') ?? '');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (search) params.set('search', search);
    else params.delete('search');
    params.delete('page');
    router.push(`/admin/equipamentos?${params.toString()}`);
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    try {
      await createEquipment({
        name,
        slug,
        description: formData.get('description') as string,
        categoryId: formData.get('categoryId') as string,
        brandId: (formData.get('brandId') as string) || undefined,
        model: (formData.get('model') as string) || undefined,
        dailyRate: Number(formData.get('dailyRate')),
        weeklyRate: Number(formData.get('weeklyRate')) || undefined,
        monthlyRate: Number(formData.get('monthlyRate')) || undefined
      });
      toast.success('Equipamento criado com sucesso');
      setOpen(false);
      router.refresh();
    } catch {
      toast.error('Erro ao criar equipamento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold">Equipamentos</h1>
        <p className="text-muted-foreground">
          Gerencie o catálogo de equipamentos
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar equipamentos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 pl-9"
            />
          </div>
          <Button type="submit" variant="secondary">
            Buscar
          </Button>
        </form>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Equipamento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Novo Equipamento</DialogTitle>
              <DialogDescription>
                Adicione um novo equipamento ao catálogo
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  placeholder="Ex: Escavadeira Hidráulica CAT 320"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="categoryId">Categoria *</Label>
                  <Select name="categoryId" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brandId">Marca</Label>
                  <Select name="brandId">
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Modelo</Label>
                <Input id="model" name="model" placeholder="Ex: 320D" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  name="description"
                  required
                  placeholder="Descrição detalhada do equipamento"
                  rows={3}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="dailyRate">Diária (R$) *</Label>
                  <Input
                    id="dailyRate"
                    name="dailyRate"
                    type="number"
                    step="0.01"
                    required
                    placeholder="0,00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weeklyRate">Semanal (R$)</Label>
                  <Input
                    id="weeklyRate"
                    name="weeklyRate"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyRate">Mensal (R$)</Label>
                  <Input
                    id="monthlyRate"
                    name="monthlyRate"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Criando...' : 'Criar Equipamento'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export { EquipmentHeader };
