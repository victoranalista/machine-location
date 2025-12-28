import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Search, Truck } from 'lucide-react';

export const CTASection = () => (
  <section className="border-y bg-muted/30 py-16">
    <div className="container mx-auto px-4 text-center">
      <div className="mx-auto max-w-3xl space-y-6">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Pronto para Começar seu Projeto?
        </h2>
        <p className="text-lg text-muted-foreground">
          Encontre preços e disponibilidade de equipamentos pesados na sua
          região agora mesmo. Sem compromisso, totalmente gratuito.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="gap-2 text-base">
            <Link href="/equipamentos">
              <Search className="h-5 w-5" />
              Buscar Equipamentos
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="gap-2 text-base"
          >
            <Link href="/fornecedor">
              <Truck className="h-5 w-5" />
              Anunciar Equipamentos
            </Link>
          </Button>
        </div>
      </div>
    </div>
  </section>
);
