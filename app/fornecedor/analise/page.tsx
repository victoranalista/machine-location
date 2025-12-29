import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { PerformanceMetrics } from './components/PerformanceMetrics';

export const metadata = {
  title: 'Análise | Portal do Fornecedor',
  description: 'Relatórios e análises de desempenho'
};

const AnalysisPage = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold tracking-tight">
        Análise e Relatórios
      </h1>
      <p className="text-muted-foreground">
        Acompanhe o desempenho do seu negócio
      </p>
    </div>
    <Suspense fallback={<Skeleton className="h-96" />}>
      <PerformanceMetrics />
    </Suspense>
    <Suspense fallback={<Skeleton className="h-96" />}>
      <AnalyticsCharts />
    </Suspense>
  </div>
);

export default AnalysisPage;
