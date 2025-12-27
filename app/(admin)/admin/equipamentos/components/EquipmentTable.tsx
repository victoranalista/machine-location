'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  Package,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { deleteEquipment, updateEquipment } from '../../actions';
import { toast } from 'sonner';
import Link from 'next/link';

type Equipment = {
  id: string;
  name: string;
  slug: string;
  mainImageUrl: string | null;
  dailyRate: { toNumber: () => number };
  status: string;
  category: { name: string } | null;
  brand: { name: string } | null;
  _count: { rentals: number };
};

type Category = { id: string; name: string; _count: { equipment: number } };
type Brand = { id: string; name: string; _count: { equipment: number } };

type EquipmentTableProps = {
  data: {
    equipment: Equipment[];
    total: number;
    totalPages: number;
  };
  categories: Category[];
  brands: Brand[];
  page: number;
  search: string;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    value
  );

const statusConfig: Record<
  string,
  {
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
  }
> = {
  AVAILABLE: { label: 'Disponível', variant: 'default' },
  RENTED: { label: 'Alugado', variant: 'secondary' },
  MAINTENANCE: { label: 'Manutenção', variant: 'outline' },
  RETIRED: { label: 'Retirado', variant: 'destructive' }
};

const EquipmentTable = ({ data, page, search }: EquipmentTableProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteEquipment(id);
      if (result.success) {
        toast.success('Equipamento excluído');
        router.refresh();
      }
    });
  };

  const handleStatusChange = (
    id: string,
    status: 'AVAILABLE' | 'RENTED' | 'MAINTENANCE' | 'RETIRED'
  ) => {
    startTransition(async () => {
      const result = await updateEquipment(id, { status });
      if (result.success) {
        toast.success('Status atualizado');
        router.refresh();
      }
    });
  };

  const buildPageUrl = (newPage: number) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    params.set('page', newPage.toString());
    return `/admin/equipamentos?${params.toString()}`;
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12" />
              <TableHead>Equipamento</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Diária</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Locações</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.equipment.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  Nenhum equipamento encontrado
                </TableCell>
              </TableRow>
            ) : (
              data.equipment.map((item) => {
                const status = statusConfig[item.status] ?? {
                  label: item.status,
                  variant: 'outline' as const
                };
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="relative h-10 w-10 overflow-hidden rounded bg-muted">
                        {item.mainImageUrl ? (
                          <Image
                            src={item.mainImageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Package className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        {item.brand && (
                          <p className="text-sm text-muted-foreground">
                            {item.brand.name}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{item.category?.name ?? '-'}</TableCell>
                    <TableCell>
                      {formatCurrency(item.dailyRate.toNumber())}
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {item._count.rentals}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={isPending}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/equipamentos/${item.slug}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver no Site
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(item.id, 'AVAILABLE')
                            }
                          >
                            Marcar Disponível
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(item.id, 'MAINTENANCE')
                            }
                          >
                            Marcar Manutenção
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Excluir Equipamento
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(item.id)}
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando {data.equipment.length} de {data.total} equipamentos
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              asChild={page > 1}
            >
              {page > 1 ? (
                <Link href={buildPageUrl(page - 1)}>
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Anterior
                </Link>
              ) : (
                <>
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Anterior
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= data.totalPages}
              asChild={page < data.totalPages}
            >
              {page < data.totalPages ? (
                <Link href={buildPageUrl(page + 1)}>
                  Próxima
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              ) : (
                <>
                  Próxima
                  <ChevronRight className="ml-1 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export { EquipmentTable };
