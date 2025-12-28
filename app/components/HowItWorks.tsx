import { Search, CheckCircle2, Truck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const steps = [
  {
    number: '1',
    title: 'Busque Equipamentos',
    description:
      'Encontre o equipamento perfeito usando nossos filtros avançados por categoria, localização e especificações técnicas.',
    icon: Search
  },
  {
    number: '2',
    title: 'Compare e Reserve',
    description:
      'Veja preços transparentes de múltiplos fornecedores, compare disponibilidade e reserve online em segundos.',
    icon: CheckCircle2
  },
  {
    number: '3',
    title: 'Receba no Local',
    description:
      'Escolha entre entrega no canteiro de obras ou retirada. Simples, rápido e totalmente seguro.',
    icon: Truck
  }
];

export const HowItWorks = () => (
  <section className="border-y bg-muted/30 py-16">
    <div className="container mx-auto px-4">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
          Como Funciona o Aluguel Online
        </h2>
        <p className="text-lg text-muted-foreground">
          Reserve seu equipamento em 3 passos simples
        </p>
      </div>
      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
        {steps.map((step, index) => (
          <div
            key={step.number}
            className="relative animate-in fade-in slide-in-from-bottom-6 duration-700"
            style={{ animationDelay: `${index * 200}ms` }}
          >
            <Card className="relative h-full transition-shadow hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  {step.number}
                </div>
                <step.icon className="mx-auto mb-4 h-12 w-12 text-primary" />
                <h3 className="mb-3 text-xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
            {index < steps.length - 1 && (
              <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 translate-x-1/2 md:block">
                <div className="h-0.5 w-8 bg-border" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
);
