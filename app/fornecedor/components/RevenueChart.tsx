'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { getRevenueData } from '../actions';
import { TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type RevenueData = { month: string; revenue: number };

export const RevenueChart = () => {
  const [data, setData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getRevenueData()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);
  if (loading)
    return (
      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle>Receita dos Últimos Meses</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64" />
        </CardContent>
      </Card>
    );
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);
  return (
    <Card className="lg:col-span-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Receita dos Últimos Meses
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((item) => (
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
  );
};
