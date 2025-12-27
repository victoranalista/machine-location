import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getUserRentals, getUserFavorites } from './actions';
import { Package, Heart, Clock, Calendar } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const StatCard = ({
  title,
  value,
  icon: Icon,
  href
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  href: string;
}) => (
  <Link href={href}>
    <Card className="transition-all hover:border-primary hover:shadow-md">
      <CardContent className="flex items-center gap-4 p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
      </CardContent>
    </Card>
  </Link>
);

const MinhaContaPage = async () => {
  const [allRentals, favorites] = await Promise.all([
    getUserRentals(),
    getUserFavorites()
  ]);
  const activeRentals = allRentals.filter((r) =>
    ['CONFIRMED', 'IN_PROGRESS'].includes(r.status)
  );
  const pendingRentals = allRentals.filter((r) => r.status === 'PENDING');
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Minha Conta</h1>
        <p className="text-muted-foreground">
          Gerencie suas locações e preferências
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Locações Ativas"
          value={activeRentals.length}
          icon={Package}
          href="/minha-conta/locacoes"
        />
        <StatCard
          title="Pendentes"
          value={pendingRentals.length}
          icon={Clock}
          href="/minha-conta/locacoes?status=pending"
        />
        <StatCard
          title="Total de Locações"
          value={allRentals.length}
          icon={Calendar}
          href="/minha-conta/locacoes"
        />
        <StatCard
          title="Favoritos"
          value={favorites.length}
          icon={Heart}
          href="/minha-conta/favoritos"
        />
      </div>
      {activeRentals.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Locações Ativas</CardTitle>
            <Link href="/minha-conta/locacoes">
              <Button variant="ghost" size="sm">
                Ver todas
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeRentals.slice(0, 3).map((rental) => (
                <div
                  key={rental.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-semibold">{rental.equipment.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {rental.rentalNumber} • {rental.totalDays} dias
                    </p>
                  </div>
                  <Link href={`/minha-conta/locacoes/${rental.id}`}>
                    <Button variant="outline" size="sm">
                      Detalhes
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MinhaContaPage;
