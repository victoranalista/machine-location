import { Suspense } from 'react';
import { getAdminDashboardStats, getRecentRentals } from './actions';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Package,
  Users,
  FileText,
  DollarSign,
  Clock,
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const metadata = {
  title: 'Admin Dashboard | EquipRent',
  description: 'Painel administrativo'
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    value
  );

type StatCardProps = {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
};

const StatCard = ({ title, value, description, icon }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </CardContent>
  </Card>
);

const StatsLoading = () => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {[1, 2, 3, 4].map((i) => (
      <Card key={i}>
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-24" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16" />
        </CardContent>
      </Card>
    ))}
  </div>
);

const StatsContent = async () => {
  const stats = await getAdminDashboardStats();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Equipamentos"
        value={stats.totalEquipment}
        description={`${stats.availableEquipment} disponíveis`}
        icon={<Package className="h-5 w-5 text-muted-foreground" />}
      />
      <StatCard
        title="Locações Ativas"
        value={stats.activeRentals}
        description={`${stats.pendingRentals} pendentes`}
        icon={<FileText className="h-5 w-5 text-muted-foreground" />}
      />
      <StatCard
        title="Usuários"
        value={stats.totalUsers}
        icon={<Users className="h-5 w-5 text-muted-foreground" />}
      />
      <StatCard
        title="Receita Total"
        value={formatCurrency(stats.totalRevenue)}
        icon={<DollarSign className="h-5 w-5 text-muted-foreground" />}
      />
    </div>
  );
};

const RentalsLoading = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-32" />
    </CardHeader>
    <CardContent className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </CardContent>
  </Card>
);

const statusConfig: Record<
  string,
  {
    label: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
  }
> = {
  PENDING: { label: 'Pendente', variant: 'secondary' },
  CONFIRMED: { label: 'Confirmada', variant: 'default' },
  IN_PROGRESS: { label: 'Em Andamento', variant: 'default' },
  COMPLETED: { label: 'Concluída', variant: 'outline' },
  CANCELLED: { label: 'Cancelada', variant: 'destructive' }
};

const RecentRentalsContent = async () => {
  const rentals = await getRecentRentals(5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Locações Recentes</CardTitle>
        <CardDescription>Últimas solicitações de locação</CardDescription>
      </CardHeader>
      <CardContent>
        {rentals.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Nenhuma locação encontrada
          </p>
        ) : (
          <div className="space-y-4">
            {rentals.map((rental) => {
              const status = statusConfig[rental.status];
              return (
                <div
                  key={rental.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{rental.equipment.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {rental.user.name ?? rental.user.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(
                        new Date(rental.createdAt),
                        "dd 'de' MMM, HH:mm",
                        { locale: ptBR }
                      )}
                    </p>
                  </div>
                  <Badge variant={status?.variant ?? 'default'}>
                    {status?.label ?? rental.status}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const QuickActionsCard = () => (
  <Card>
    <CardHeader>
      <CardTitle>Ações Rápidas</CardTitle>
      <CardDescription>Acesso rápido às principais funções</CardDescription>
    </CardHeader>
    <CardContent className="grid gap-2">
      <a
        href="/admin/equipamentos"
        className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted"
      >
        <Package className="h-5 w-5 text-primary" />
        <div>
          <p className="font-medium">Gerenciar Equipamentos</p>
          <p className="text-sm text-muted-foreground">
            Adicionar, editar ou remover
          </p>
        </div>
      </a>
      <a
        href="/admin/locacoes?status=PENDING"
        className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted"
      >
        <Clock className="h-5 w-5 text-yellow-500" />
        <div>
          <p className="font-medium">Locações Pendentes</p>
          <p className="text-sm text-muted-foreground">Aprovar ou recusar</p>
        </div>
      </a>
      <a
        href="/admin/categorias"
        className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted"
      >
        <CheckCircle className="h-5 w-5 text-green-500" />
        <div>
          <p className="font-medium">Categorias</p>
          <p className="text-sm text-muted-foreground">
            Organizar equipamentos
          </p>
        </div>
      </a>
    </CardContent>
  </Card>
);

const AdminDashboardPage = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">Visão geral do sistema</p>
    </div>

    <Suspense fallback={<StatsLoading />}>
      <StatsContent />
    </Suspense>

    <div className="grid gap-6 lg:grid-cols-2">
      <Suspense fallback={<RentalsLoading />}>
        <RecentRentalsContent />
      </Suspense>
      <QuickActionsCard />
    </div>
  </div>
);

export default AdminDashboardPage;
