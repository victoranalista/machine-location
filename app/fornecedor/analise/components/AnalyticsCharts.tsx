'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { getRevenueData, getEquipmentPerformance } from '../../actions';
import { BarChart3, TrendingUp } from 'lucide-react';

type RevenueData = { month: string; revenue: number };
type EquipmentData = {
  id: string;
  name: string;
  totalRentals: number;
  totalRevenue: number;
};

export const AnalyticsCharts = () => {
  const [revenue, setRevenue] = useState<RevenueData[]>([]);
  const [equipment, setEquipment] = useState<EquipmentData[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([getRevenueData(), getEquipmentPerformance()])
      .then(([rev, eq]) => {
        setRevenue(rev);
        setEquipment(eq);
      })
      .finally(() => setLoading(false));
  }, []);
  if (loading)
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="h-64 animate-pulse rounded bg-muted" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="h-64 animate-pulse rounded bg-muted" />
          </CardContent>
        </Card>
      </div>
    );
  const maxRevenue = Math.max(...revenue.map((d) => d.revenue), 1);
  const maxRentals = Math.max(...equipment.map((e) => e.totalRentals), 1);
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Evolução da Receita
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {revenue.map((item) => (
              <div key={item.month} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium capitalize">{item.month}</span>
                  <span className="font-semibold">
                    R${' '}
                    {item.revenue.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2
                    })}
                  </span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500"
                    style={{ width: `${(item.revenue / maxRevenue) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Equipamentos Mais Alugados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {equipment.map((eq) => (
              <div key={eq.id} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium line-clamp-1">{eq.name}</span>
                  <span className="font-semibold">
                    {eq.totalRentals} locações
                  </span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-green-600 transition-all duration-500"
                    style={{
                      width: `${(eq.totalRentals / maxRentals) * 100}%`
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  R${' '}
                  {eq.totalRevenue.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2
                  })}{' '}
                  em receita
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
