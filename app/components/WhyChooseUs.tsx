import {
  Shield,
  Clock,
  BadgeDollarSign,
  Truck,
  Headphones,
  Award
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: Shield,
    title: 'Fornecedores Verificados',
    description:
      'Todos os fornecedores são rigorosamente verificados e aprovados. Sua segurança é nossa prioridade máxima.'
  },
  {
    icon: Clock,
    title: 'Disponibilidade 24/7',
    description:
      'Reserve equipamentos a qualquer hora, de qualquer lugar. Acesso total à plataforma sem limitações.'
  },
  {
    icon: BadgeDollarSign,
    title: 'Preços Transparentes',
    description:
      'Sem taxas ocultas ou surpresas. Veja o preço total incluindo entrega antes de confirmar a reserva.'
  },
  {
    icon: Truck,
    title: 'Entrega Rápida',
    description:
      'Rede nacional de fornecedores garante entrega rápida onde você estiver, em todo o território nacional.'
  },
  {
    icon: Headphones,
    title: 'Suporte Dedicado',
    description:
      'Equipe especializada pronta para ajudar com qualquer dúvida ou problema durante todo o processo.'
  },
  {
    icon: Award,
    title: 'Melhor Custo-Benefício',
    description:
      'Compare preços de múltiplos fornecedores e escolha a melhor opção para seu projeto e orçamento.'
  }
];

export const WhyChooseUs = () => (
  <section className="container mx-auto px-4 py-16">
    <div className="mb-12 text-center">
      <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
        Por Que Escolher Nossa Plataforma
      </h2>
      <p className="text-lg text-muted-foreground">
        A solução completa para aluguel de equipamentos pesados
      </p>
    </div>
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {features.map((feature, index) => (
        <Card
          key={feature.title}
          className="group transition-all hover:shadow-lg hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 duration-700"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardContent className="p-6">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
              <feature.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-bold">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">
              {feature.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  </section>
);
