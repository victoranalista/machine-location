import { Suspense } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Package,
  DollarSign,
  Clock,
  CheckCircle,
  Plus,
  FileText
} from 'lucide-react';
import { getSupplierDashboardStats } from './actions';

export const metadata = {
  title: 'Painel do Fornecedor | EquipRent',
  description: 'Gerencie seus equipamentos'
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
      <Skeleton key={i} className="h-32" />
    ))}
  </div>
);

const StatsContent = async () => {
  const stats = await getSupplierDashboardStats();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Meus Equipamentos"
        value={stats.totalEquipment}
        icon={<Package className="h-5 w-5 text-muted-foreground" />}
      />
      <StatCard
        title="Locações Ativas"
        value={stats.activeRentals}
        icon={<FileText className="h-5 w-5 text-muted-foreground" />}
      />
      <StatCard
        title="Aguardando Aprovação"
        value={stats.pendingApproval}
        icon={<Clock className="h-5 w-5 text-yellow-500" />}
      />
      <StatCard
        title="Receita Total"
        value={formatCurrency(stats.totalRevenue)}
        icon={<DollarSign className="h-5 w-5 text-green-500" />}
      />
    </div>
  );
};

const QuickActionsCard = () => (
  <Card>
    <CardHeader>
      <CardTitle>Ações Rápidas</CardTitle>
      <CardDescription>Gerencie seus equipamentos</CardDescription>
    </CardHeader>
    <CardContent className="grid gap-2">
      <Link href="/fornecedor/equipamentos/novo">
        <Button className="w-full justify-start" variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Cadastrar Novo Equipamento
        </Button>
      </Link>
      <Link href="/fornecedor/equipamentos">
        <Button className="w-full justify-start" variant="outline">
          <Package className="mr-2 h-4 w-4" />
          Ver Meus Equipamentos
        </Button>
      </Link>
      <Link href="/fornecedor/locacoes">
        <Button className="w-full justify-start" variant="outline">
          <FileText className="mr-2 h-4 w-4" />
          Ver Locações
        </Button>
      </Link>
    </CardContent>
  </Card>
);

const GuideCard = () => (
  <Card>
    <CardHeader>
      <CardTitle>Primeiros Passos</CardTitle>
      <CardDescription>Como começar a anunciar</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex items-start gap-3">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
          1
        </div>
        <div>
          <p className="font-medium">Cadastre seus equipamentos</p>
          <p className="text-sm text-muted-foreground">
            Adicione fotos, descrição e valores de locação
          </p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
          2
        </div>
        <div>
          <p className="font-medium">Aguarde aprovação</p>
          <p className="text-sm text-muted-foreground">
            Nossa equipe irá revisar em até 24h
          </p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
          3
        </div>
        <div>
          <p className="font-medium">Comece a receber locações</p>
          <p className="text-sm text-muted-foreground">
            Gerencie tudo pelo painel
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);

const FornecedorDashboardPage = () => (
  <div className="container mx-auto space-y-6 p-6">
    <div>
      <h1 className="text-3xl font-bold">Painel do Fornecedor</h1>
      <p className="text-muted-foreground">
        Gerencie seus equipamentos e locações
      </p>
    </div>

    <Suspense fallback={<StatsLoading />}>
      <StatsContent />
    </Suspense>

    <div className="grid gap-6 lg:grid-cols-2">
      <QuickActionsCard />
      <GuideCard />
    </div>
  </div>
);

export default FornecedorDashboardPage;
