import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Search,
  MapPin,
  Calendar,
  ArrowRight,
  Shield,
  Clock,
  Headphones,
  Truck,
  Star,
  CheckCircle2
} from 'lucide-react';
import {
  getCategories,
  getFeaturedEquipment,
  getPopularLocations
} from './actions';
import { EquipmentCardComponent } from './components/EquipmentCard';
import { CategoryCard } from './components/CategoryCard';

const HeroSection = () => (
  <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted py-20 lg:py-32">
    <div className="container relative">
      <div className="mx-auto max-w-4xl text-center">
        <Badge variant="outline" className="mb-4">
          +5.000 equipamentos disponíveis em todo Brasil
        </Badge>
        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Alugue Máquinas Pesadas com
          <span className="text-primary"> Facilidade</span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
          A plataforma mais completa para locação de equipamentos de construção.
          Compare preços, reserve online e receba no seu canteiro de obras.
        </p>
        <div className="mx-auto max-w-2xl">
          <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-lg sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="O que você precisa? Ex: Escavadeira, Guindaste..."
                className="h-12 border-0 bg-transparent pl-10 shadow-none focus-visible:ring-0"
              />
            </div>
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cidade ou estado"
                className="h-12 border-0 bg-transparent pl-10 shadow-none focus-visible:ring-0"
              />
            </div>
            <Link href="/equipamentos">
              <Button size="lg" className="h-12 w-full px-8 sm:w-auto">
                Buscar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span>Equipamentos verificados</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span>Preços transparentes</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span>Entrega inclusa</span>
          </div>
        </div>
      </div>
    </div>
    <div className="absolute -bottom-1/2 -right-1/4 h-[800px] w-[800px] rounded-full bg-primary/5 blur-3xl" />
    <div className="absolute -left-1/4 -top-1/2 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
  </section>
);

const CategoriesSection = async () => {
  const categories = await getCategories();
  if (categories.length === 0) return null;
  return (
    <section className="py-16 lg:py-24">
      <div className="container">
        <div className="mb-12 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Categorias de Equipamentos
            </h2>
            <p className="mt-2 text-muted-foreground">
              Encontre o equipamento ideal para sua obra
            </p>
          </div>
          <Link href="/categorias">
            <Button variant="outline">
              Ver todas
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.slice(0, 8).map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
};

const FeaturedEquipmentSection = async () => {
  const equipment = await getFeaturedEquipment(8);
  if (equipment.length === 0) return null;
  return (
    <section className="bg-muted/30 py-16 lg:py-24">
      <div className="container">
        <div className="mb-12 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Equipamentos em Destaque
            </h2>
            <p className="mt-2 text-muted-foreground">
              Os mais procurados pelos nossos clientes
            </p>
          </div>
          <Link href="/equipamentos">
            <Button variant="outline">
              Ver todos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {equipment.map((eq) => (
            <EquipmentCardComponent key={eq.id} equipment={eq} />
          ))}
        </div>
      </div>
    </section>
  );
};

const benefitsData = [
  {
    icon: Shield,
    title: 'Equipamentos Verificados',
    description:
      'Todos os equipamentos passam por rigorosa inspeção de qualidade e segurança.'
  },
  {
    icon: Clock,
    title: 'Reserva Rápida',
    description:
      'Reserve em minutos com confirmação instantânea e preços transparentes.'
  },
  {
    icon: Truck,
    title: 'Entrega no Local',
    description:
      'Entrega e retirada no seu canteiro de obras com horário agendado.'
  },
  {
    icon: Headphones,
    title: 'Suporte 24/7',
    description: 'Equipe técnica disponível para ajudar quando você precisar.'
  }
];

const BenefitsSection = () => (
  <section className="py-16 lg:py-24">
    <div className="container">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          Por que escolher a MaquinaLoc?
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
          Simplificamos a locação de equipamentos para que você foque no que
          importa: sua obra.
        </p>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {benefitsData.map((benefit) => (
          <Card key={benefit.title} className="border-0 bg-muted/50">
            <CardContent className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <benefit.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground">
                {benefit.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

const HowItWorksSection = () => (
  <section className="bg-muted/30 py-16 lg:py-24">
    <div className="container">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Como Funciona</h2>
        <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
          Alugar equipamentos nunca foi tão simples
        </p>
      </div>
      <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
        {[
          {
            step: '1',
            title: 'Busque',
            description:
              'Encontre o equipamento ideal usando nossa busca inteligente'
          },
          {
            step: '2',
            title: 'Compare',
            description:
              'Veja preços, disponibilidade e especificações técnicas'
          },
          {
            step: '3',
            title: 'Reserve',
            description: 'Faça sua reserva online e receba no local da obra'
          }
        ].map((item) => (
          <div key={item.step} className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
              {item.step}
            </div>
            <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
            <p className="text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </div>
      <div className="mt-12 text-center">
        <Link href="/como-funciona">
          <Button size="lg">
            Saiba mais
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  </section>
);

const LocationsSection = async () => {
  const locations = await getPopularLocations(6);
  if (locations.length === 0) return null;
  return (
    <section className="py-16 lg:py-24">
      <div className="container">
        <div className="mb-12 flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Disponível em Todo Brasil
            </h2>
            <p className="mt-2 text-muted-foreground">
              Equipamentos disponíveis nas principais cidades
            </p>
          </div>
          <Link href="/locais">
            <Button variant="outline">
              Ver todas
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((location) => (
            <Link
              key={location.id}
              href={`/equipamentos?cidade=${location.city}&estado=${location.state}`}
            >
              <Card className="group transition-all hover:border-primary hover:shadow-md">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold group-hover:text-primary">
                      {location.city}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {location.state}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => (
  <section className="bg-primary py-16 lg:py-24">
    <div className="container text-center">
      <h2 className="mb-4 text-3xl font-bold tracking-tight text-primary-foreground">
        Pronto para começar?
      </h2>
      <p className="mx-auto mb-8 max-w-2xl text-primary-foreground/80">
        Cadastre-se gratuitamente e tenha acesso a milhares de equipamentos
        disponíveis para locação em todo o Brasil.
      </p>
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <Link href="/equipamentos">
          <Button size="lg" variant="secondary">
            Buscar Equipamentos
          </Button>
        </Link>
        <Link href="/login">
          <Button
            size="lg"
            variant="outline"
            className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
          >
            Criar Conta Grátis
          </Button>
        </Link>
      </div>
    </div>
  </section>
);

const HomePage = async () => (
  <>
    <HeroSection />
    <CategoriesSection />
    <FeaturedEquipmentSection />
    <BenefitsSection />
    <HowItWorksSection />
    <LocationsSection />
    <CTASection />
  </>
);

export default HomePage;
