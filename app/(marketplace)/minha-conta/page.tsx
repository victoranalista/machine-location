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
  <Link href={href} className="block">
    <Card className="transition-all hover:border-primary hover:shadow-md">
      <CardContent className="flex items-center gap-3 p-4 sm:gap-4 sm:p-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 sm:h-12 sm:w-12">
          <Icon className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xl font-bold sm:text-2xl">{value}</p>
          <p className="truncate text-xs text-muted-foreground sm:text-sm">
            {title}
          </p>
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
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Minha Conta
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Gerencie suas locações e preferências
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
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
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg sm:text-xl">
              Locações Ativas
            </CardTitle>
            <Link href="/minha-conta/locacoes">
              <Button variant="ghost" size="sm">
                Ver todas
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {activeRentals.slice(0, 3).map((rental) => (
                <div
                  key={rental.id}
                  className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">
                      {rental.equipment.name}
                    </p>
                    <p className="text-xs text-muted-foreground sm:text-sm">
                      {rental.rentalNumber} • {rental.totalDays} dias
                    </p>
                  </div>
                  <Link href={`/minha-conta/locacoes/${rental.id}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto"
                    >
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
