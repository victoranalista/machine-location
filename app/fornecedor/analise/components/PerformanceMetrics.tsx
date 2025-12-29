import { getDashboardStats, getRevenueData } from '../../actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Package
} from 'lucide-react';

export const PerformanceMetrics = async () => {
  const stats = await getDashboardStats();
  const revenueData = await getRevenueData();
  const currentMonth = revenueData[revenueData.length - 1]?.revenue ?? 0;
  const lastMonth = revenueData[revenueData.length - 2]?.revenue ?? 0;
  const growth = lastMonth ? ((currentMonth - lastMonth) / lastMonth) * 100 : 0;
  const isPositive = growth >= 0;
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            R${' '}
            {stats.totalRevenue.toLocaleString('pt-BR', {
              minimumFractionDigits: 2
            })}
          </div>
          <div
            className={`mt-2 flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {Math.abs(growth).toFixed(1)}% vs mês anterior
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Equipamentos Cadastrados
          </CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalEquipment}</div>
          <p className="mt-2 text-xs text-muted-foreground">
            Total de equipamentos ativos
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Taxa de Ocupação
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.totalEquipment > 0
              ? Math.round((stats.activeRentals / stats.totalEquipment) * 100)
              : 0}
            %
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {stats.activeRentals} de {stats.totalEquipment} equipamentos
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
