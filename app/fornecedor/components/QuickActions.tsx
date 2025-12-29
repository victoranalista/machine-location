import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Package, Calendar, BarChart } from 'lucide-react';

const actions = [
  {
    href: '/fornecedor/equipamentos/novo',
    label: 'Novo Equipamento',
    icon: Plus,
    variant: 'default' as const
  },
  {
    href: '/fornecedor/equipamentos',
    label: 'Meus Equipamentos',
    icon: Package,
    variant: 'outline' as const
  },
  {
    href: '/fornecedor/locacoes',
    label: 'Ver Locações',
    icon: Calendar,
    variant: 'outline' as const
  },
  {
    href: '/fornecedor/analise',
    label: 'Relatórios',
    icon: BarChart,
    variant: 'outline' as const
  }
];

export const QuickActions = () => (
  <Card>
    <CardHeader>
      <CardTitle>Ações Rápidas</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action) => (
          <Link key={action.href} href={action.href}>
            <Button
              variant={action.variant}
              className="h-auto w-full flex-col gap-2 py-4"
            >
              <action.icon className="h-5 w-5" />
              <span className="text-sm">{action.label}</span>
            </Button>
          </Link>
        ))}
      </div>
    </CardContent>
  </Card>
);
