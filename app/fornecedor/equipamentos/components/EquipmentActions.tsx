'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { MoreVertical, Edit, Trash, Eye, Power } from 'lucide-react';
import { useState } from 'react';
import { deleteEquipment, updateEquipmentStatus } from '../actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { EquipmentStatus } from '@prisma/client';

type Equipment = {
  id: string;
  name: string;
  status: EquipmentStatus;
};

type EquipmentActionsProps = {
  equipment: Equipment;
};

export const EquipmentActions = ({ equipment }: EquipmentActionsProps) => {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteEquipment(equipment.id);
      toast.success('Equipamento excluído com sucesso');
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Erro ao excluir equipamento'
      );
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
    }
  };
  const handleToggleStatus = async () => {
    const newStatus =
      equipment.status === EquipmentStatus.AVAILABLE
        ? EquipmentStatus.UNAVAILABLE
        : EquipmentStatus.AVAILABLE;
    try {
      await updateEquipmentStatus(equipment.id, newStatus);
      toast.success('Status atualizado com sucesso');
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Erro ao atualizar status'
      );
    }
  };
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => router.push(`/equipamentos/${equipment.id}`)}
          >
            <Eye className="mr-2 h-4 w-4" />
            Visualizar
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              router.push(`/fornecedor/equipamentos/editar/${equipment.id}`)
            }
          >
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleToggleStatus}>
            <Power className="mr-2 h-4 w-4" />
            {equipment.status === EquipmentStatus.AVAILABLE
              ? 'Desativar'
              : 'Ativar'}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive"
          >
            <Trash className="mr-2 h-4 w-4" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir <strong>{equipment.name}</strong>?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={loading}>
              {loading ? 'Excluindo...' : 'Excluir'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
