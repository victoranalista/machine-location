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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MoreVertical, Check, Play, Ban, Eye } from 'lucide-react';
import { useState } from 'react';
import { updateRentalStatus } from '../../actions';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { RentalStatus, PaymentStatus } from '@prisma/client';

type Rental = {
  id: string;
  rentalNumber: string;
  status: RentalStatus;
  paymentStatus: PaymentStatus;
};

type RentalActionsProps = {
  rental: Rental;
};

export const RentalActions = ({ rental }: RentalActionsProps) => {
  const router = useRouter();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [loading, setLoading] = useState(false);
  const handleUpdateStatus = async (
    status: 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED'
  ) => {
    setLoading(true);
    try {
      await updateRentalStatus(rental.id, status);
      toast.success('Status atualizado com sucesso');
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Erro ao atualizar status'
      );
    } finally {
      setLoading(false);
    }
  };
  const handleCancel = async () => {
    if (!cancelReason.trim()) {
      toast.error('Informe o motivo do cancelamento');
      return;
    }
    setLoading(true);
    try {
      await updateRentalStatus(rental.id, 'CANCELLED', cancelReason);
      toast.success('Locação cancelada com sucesso');
      router.refresh();
      setShowCancelDialog(false);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Erro ao cancelar locação'
      );
    } finally {
      setLoading(false);
    }
  };
  const canConfirm = rental.status === RentalStatus.PENDING;
  const canStart = rental.status === RentalStatus.CONFIRMED;
  const canComplete = rental.status === RentalStatus.IN_PROGRESS;
  const canCancel =
    rental.status === RentalStatus.PENDING ||
    rental.status === RentalStatus.CONFIRMED;
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() =>
              router.push(`/fornecedor/locacoes/detalhes/${rental.id}`)
            }
          >
            <Eye className="mr-2 h-4 w-4" />
            Ver detalhes
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {canConfirm && (
            <DropdownMenuItem onClick={() => handleUpdateStatus('CONFIRMED')}>
              <Check className="mr-2 h-4 w-4" />
              Confirmar locação
            </DropdownMenuItem>
          )}
          {canStart && (
            <DropdownMenuItem onClick={() => handleUpdateStatus('IN_PROGRESS')}>
              <Play className="mr-2 h-4 w-4" />
              Iniciar locação
            </DropdownMenuItem>
          )}
          {canComplete && (
            <DropdownMenuItem onClick={() => handleUpdateStatus('COMPLETED')}>
              <Check className="mr-2 h-4 w-4" />
              Finalizar locação
            </DropdownMenuItem>
          )}
          {canCancel && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowCancelDialog(true)}
                className="text-destructive"
              >
                <Ban className="mr-2 h-4 w-4" />
                Cancelar locação
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar locação</DialogTitle>
            <DialogDescription>
              Informe o motivo do cancelamento da locação #{rental.rentalNumber}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reason">Motivo</Label>
            <Textarea
              id="reason"
              placeholder="Descreva o motivo do cancelamento..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
              disabled={loading}
            >
              Voltar
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={loading}
            >
              {loading ? 'Cancelando...' : 'Confirmar cancelamento'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
