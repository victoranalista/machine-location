'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import {
  createEquipment,
  updateEquipment,
  getCategories,
  getBrands
} from '../actions';
import { Loader2 } from 'lucide-react';

const equipmentSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
  shortDescription: z.string().optional(),
  categoryId: z.string().min(1, 'Selecione uma categoria'),
  brandId: z.string().optional(),
  model: z.string().optional(),
  year: z.coerce.number().optional(),
  dailyRate: z.coerce.number().min(1, 'Valor da diária é obrigatório'),
  weeklyRate: z.coerce.number().optional(),
  monthlyRate: z.coerce.number().optional(),
  minRentalDays: z.coerce.number().optional(),
  depositAmount: z.coerce.number().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  mainImageUrl: z.string().url('URL inválida').optional().or(z.literal(''))
});

type EquipmentFormData = z.infer<typeof equipmentSchema>;

type Equipment = {
  id: string;
  name: string;
  description: string;
  shortDescription?: string | null;
  categoryId: string;
  brandId?: string | null;
  model?: string | null;
  year?: number | null;
  dailyRate: number;
  weeklyRate?: number | null;
  monthlyRate?: number | null;
  minRentalDays?: number | null;
  depositAmount?: number | null;
  city?: string | null;
  state?: string | null;
  mainImageUrl?: string | null;
};

type EquipmentFormProps = {
  equipment?: Equipment;
};

export const EquipmentForm = ({ equipment }: EquipmentFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [brands, setBrands] = useState<Array<{ id: string; name: string }>>([]);
  const form = useForm<EquipmentFormData>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      name: equipment?.name ?? '',
      description: equipment?.description ?? '',
      shortDescription: equipment?.shortDescription ?? '',
      categoryId: equipment?.categoryId ?? '',
      brandId: equipment?.brandId ?? '',
      model: equipment?.model ?? '',
      year: equipment?.year ?? undefined,
      dailyRate: equipment?.dailyRate ?? 0,
      weeklyRate: equipment?.weeklyRate ?? undefined,
      monthlyRate: equipment?.monthlyRate ?? undefined,
      minRentalDays: equipment?.minRentalDays ?? 1,
      depositAmount: equipment?.depositAmount ?? undefined,
      city: equipment?.city ?? '',
      state: equipment?.state ?? '',
      mainImageUrl: equipment?.mainImageUrl ?? ''
    }
  });
  useEffect(() => {
    Promise.all([getCategories(), getBrands()])
      .then(([cats, brs]) => {
        setCategories(cats);
        setBrands(brs);
      })
      .catch(() => toast.error('Erro ao carregar dados'));
  }, []);
  const onSubmit = async (data: EquipmentFormData) => {
    setLoading(true);
    try {
      if (equipment) {
        await updateEquipment(equipment.id, data);
        toast.success('Equipamento atualizado com sucesso');
      } else {
        await createEquipment(data);
        toast.success('Equipamento criado com sucesso');
      }
      router.push('/fornecedor/equipamentos');
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Erro ao salvar equipamento'
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Equipamento</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: Escavadeira Hidráulica"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shortDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição Curta</FormLabel>
                  <FormControl>
                    <Input placeholder="Resumo do equipamento..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição Completa</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva as características e benefícios..."
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="brandId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marca</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {brands.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modelo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 320D" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ano</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Ex: 2023" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Valores e Locação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <FormField
                control={form.control}
                name="dailyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diária (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="weeklyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Semanal (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Opcional</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="monthlyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mensal (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Opcional</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="depositAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Caução (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Opcional</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="minRentalDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mínimo de dias</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Localização e Imagem</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: São Paulo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: SP" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="mainImageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL da Imagem Principal</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://exemplo.com/imagem.jpg"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Cole a URL de uma imagem do equipamento
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {equipment ? 'Salvar Alterações' : 'Criar Equipamento'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
