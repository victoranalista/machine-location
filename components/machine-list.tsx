import { Machine } from "@/lib/types";
import { MachineCard } from "./machine-card";

interface MachineListProps {
  machines: Machine[];
}

export function MachineList({ machines }: MachineListProps) {
  if (machines.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed">
        <div className="text-center">
          <h3 className="text-lg font-semibold">Nenhum equipamento encontrado</h3>
          <p className="text-sm text-muted-foreground">
            Tente ajustar seus filtros de busca
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {machines.map((machine) => (
        <MachineCard key={machine.id} machine={machine} />
      ))}
    </div>
  );
}
