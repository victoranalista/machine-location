import { getDashboardStats } from '../actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Package,
  Calendar,
  TrendingUp,
  DollarSign,
  AlertCircle
} from 'lucide-react';

export const StatsCards = async () => {
  const stats = await getDashboardStats();
  const statsData = [
    {
      title: 'Total de Equipamentos',
      value: stats.totalEquipment.toString(),
      icon: Package,
      description: 'Cadastrados na plataforma',
      trend: null
    },
    {
      title: 'Locações Ativas',
      value: stats.activeRentals.toString(),
      icon: Calendar,
      description: 'Em andamento',
      trend: '+12% vs mês passado'
    },
    {
      title: 'Aguardando Confirmação',
      value: stats.pendingRentals.toString(),
      icon: AlertCircle,
      description: 'Necessitam atenção',
      trend: null
    },
    {
      title: 'Receita do Mês',
      value: `R$ ${stats.monthRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      description: `Total: R$ ${stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      trend: '+8% vs mês passado'
    }
  ];
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => (
        <Card key={index} className="transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
            {stat.trend && (
              <div className="mt-2 flex items-center gap-1 text-xs font-medium text-green-600">
                <TrendingUp className="h-3 w-3" />
                {stat.trend}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
