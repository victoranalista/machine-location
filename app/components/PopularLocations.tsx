import Link from 'next/link';
import { MapPin, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const locations = [
  { city: 'São Paulo', state: 'SP', equipmentCount: 1250, region: 'Sudeste' },
  {
    city: 'Rio de Janeiro',
    state: 'RJ',
    equipmentCount: 890,
    region: 'Sudeste'
  },
  {
    city: 'Belo Horizonte',
    state: 'MG',
    equipmentCount: 650,
    region: 'Sudeste'
  },
  {
    city: 'Brasília',
    state: 'DF',
    equipmentCount: 520,
    region: 'Centro-Oeste'
  },
  { city: 'Curitiba', state: 'PR', equipmentCount: 480, region: 'Sul' },
  { city: 'Porto Alegre', state: 'RS', equipmentCount: 430, region: 'Sul' },
  { city: 'Salvador', state: 'BA', equipmentCount: 380, region: 'Nordeste' },
  { city: 'Recife', state: 'PE', equipmentCount: 340, region: 'Nordeste' }
];

export const PopularLocations = () => (
  <section className="relative overflow-hidden py-20">
    <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
    <div className="container relative mx-auto px-4">
      <div className="mb-16 text-center">
        <Badge
          variant="outline"
          className="mb-4 animate-in fade-in slide-in-from-top-4 duration-700"
        >
          <MapPin className="mr-1 h-3 w-3" />
          +100 Cidades
        </Badge>
        <h2 className="mb-4 animate-in fade-in slide-in-from-top-4 text-4xl font-bold tracking-tight duration-700 delay-100 md:text-5xl">
          Presença Nacional
        </h2>
        <p className="mx-auto max-w-2xl animate-in fade-in slide-in-from-top-4 text-lg text-muted-foreground duration-700 delay-200">
          Conectamos você aos melhores equipamentos em todo o Brasil
        </p>
      </div>
      <div className="mx-auto grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {locations.map((location, index) => (
          <Link
            key={`${location.city}-${location.state}`}
            href={`/equipamentos?cidade=${location.city}`}
            className="group animate-in fade-in zoom-in-95 duration-700"
            style={{ animationDelay: `${300 + index * 100}ms` }}
          >
            <Card className="relative overflow-hidden border-2 transition-all duration-300 hover:border-foreground/20 hover:shadow-2xl hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-background to-muted/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <CardContent className="relative p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="mb-1 text-xl font-bold transition-colors duration-300 group-hover:text-foreground">
                      {location.city}
                    </h3>
                    <p className="text-sm font-medium text-muted-foreground">
                      {location.state} · {location.region}
                    </p>
                  </div>
                  <div className="rounded-full bg-muted p-2 transition-all duration-300 group-hover:bg-foreground group-hover:text-background">
                    <MapPin className="h-5 w-5" />
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-semibold">
                    {location.equipmentCount}+
                  </span>
                  <span className="text-xs text-muted-foreground">
                    equipamentos
                  </span>
                </div>
              </CardContent>
              <div className="absolute bottom-0 left-0 h-1 w-0 bg-foreground transition-all duration-300 group-hover:w-full" />
            </Card>
          </Link>
        ))}
      </div>
      <div className="mt-16 animate-in fade-in slide-in-from-bottom-4 text-center duration-700 delay-1000">
        <Button asChild size="lg" className="group gap-2">
          <Link href="/areas-atendimento">
            Ver Todas as Cidades
            <MapPin className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
          </Link>
        </Button>
      </div>
    </div>
  </section>
);
