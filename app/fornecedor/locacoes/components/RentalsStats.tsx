import { getRentalsStats } from '../actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, CheckCircle, Play, Award } from 'lucide-react';

export const RentalsStats = async () => {
  const stats = await getRentalsStats();
  const statsData = [
    {
      title: 'Pendentes',
      value: stats.pending.toString(),
      icon: Clock,
      description: 'Aguardando confirmação'
    },
    {
      title: 'Confirmadas',
      value: stats.confirmed.toString(),
      icon: CheckCircle,
      description: 'Prontas para iniciar'
    },
    {
      title: 'Em Andamento',
      value: stats.inProgress.toString(),
      icon: Play,
      description: 'Ativas no momento'
    },
    {
      title: 'Concluídas',
      value: stats.completed.toString(),
      icon: Award,
      description: 'Total finalizado'
    }
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
