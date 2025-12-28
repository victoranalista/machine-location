import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    name: 'Escavadeiras',
    slug: 'escavadeira',
    image: '/image/escavadeira.png',
    count: '250+'
  },
  {
    name: 'Empilhadeiras',
    slug: 'empilhadeira',
    image: '/image/empilhadeira.png',
    count: '180+'
  },
  {
    name: 'Guindastes',
    slug: 'guindaste',
    image: '/image/guindaste.png',
    count: '120+'
  },
  {
    name: 'Retroescavadeiras',
    slug: 'retroescavadeira',
    image: '/image/retroescavadeira.png',
    count: '200+'
  },
  {
    name: 'Compactadores',
    slug: 'compactador',
    image: '/image/compactador.png',
    count: '90+'
  },
  {
    name: 'Geradores',
    slug: 'gerador',
    image: '/image/gerador.png',
    count: '150+'
  },
  {
    name: 'Plataformas Elevatórias',
    slug: 'plataforma',
    image: '/image/plataforma.png',
    count: '140+'
  },
  {
    name: 'Tratores',
    slug: 'trator',
    image: '/image/trator.png',
    count: '110+'
  }
];

export const PopularCategories = () => (
  <section className="container mx-auto px-4 py-16">
    <div className="mb-12 text-center">
      <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
        Encontre o Equipamento Certo para seu Projeto
      </h2>
      <p className="text-lg text-muted-foreground">
        Navegue por nossas categorias mais populares
      </p>
    </div>
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {categories.map((category, index) => (
        <Link
          key={category.slug}
          href={`/equipamentos?categoria=${category.slug}`}
          className="group animate-in fade-in slide-in-from-bottom-4 duration-700"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <Card className="overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <p className="text-sm font-medium opacity-90">
                  {category.count} disponíveis
                </p>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold group-hover:text-primary transition-colors">
                {category.name}
              </h3>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
    <div className="mt-10 text-center">
      <Button asChild variant="outline" size="lg">
        <Link href="/equipamentos">
          Ver Todas as Categorias
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  </section>
);
