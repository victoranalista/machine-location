import { Card, CardContent } from '@/components/ui/card';
import { Shield, Users, Award, TrendingUp } from 'lucide-react';
import { Header } from '../(marketplace)/components/Header';
import { Footer } from '../(marketplace)/components/Footer';

const stats = [
  { label: 'Equipamentos Disponíveis', value: '5.000+', icon: TrendingUp },
  { label: 'Fornecedores Verificados', value: '500+', icon: Shield },
  { label: 'Clientes Satisfeitos', value: '10.000+', icon: Users },
  { label: 'Cidades Atendidas', value: '100+', icon: Award }
];

const values = [
  {
    title: 'Transparência Total',
    description:
      'Acreditamos em preços claros e processos transparentes. Sem taxas ocultas, sem surpresas.'
  },
  {
    title: 'Segurança em Primeiro Lugar',
    description:
      'Todos os fornecedores são verificados e os equipamentos passam por inspeção rigorosa.'
  },
  {
    title: 'Tecnologia e Inovação',
    description:
      'Utilizamos tecnologia de ponta para facilitar o aluguel de equipamentos pesados.'
  },
  {
    title: 'Suporte Dedicado',
    description:
      'Nossa equipe está sempre pronta para ajudar você a encontrar a solução ideal.'
  }
];

const SobrePage = () => (
  <div className="flex min-h-screen flex-col">
    <Header />
    <main className="flex-1 flex flex-col">
      <section className="bg-gradient-to-br from-primary/5 to-background py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">
              Sobre Nós
            </h1>
            <p className="text-lg text-muted-foreground">
              Somos a plataforma líder em aluguel de equipamentos pesados no
              Brasil, conectando empresas de construção a fornecedores
              verificados em todo o país.
            </p>
          </div>
        </div>
      </section>
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6 text-center">
                <stat.icon className="mx-auto mb-4 h-10 w-10 text-primary" />
                <div className="mb-2 text-3xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Nossa Missão</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Transformar a forma como empresas de construção alugam
              equipamentos, tornando o processo mais simples, transparente e
              eficiente.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {values.map((value) => (
              <Card key={value.title}>
                <CardContent className="p-6">
                  <h3 className="mb-3 text-xl font-bold">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 text-3xl font-bold">Nossa História</h2>
          <div className="space-y-4 text-left text-muted-foreground">
            <p>
              Fundada em 2024, nossa plataforma nasceu da necessidade de
              simplificar o processo de aluguel de equipamentos pesados no
              Brasil. Vimos como empresas de construção perdiam tempo e dinheiro
              procurando equipamentos, negociando preços e lidando com processos
              burocráticos.
            </p>
            <p>
              Decidimos criar uma solução que conectasse fornecedores
              verificados a empresas que precisam de equipamentos, tudo em uma
              plataforma digital moderna, segura e transparente.
            </p>
            <p>
              Hoje, somos a maior plataforma de aluguel de equipamentos pesados
              do Brasil, com milhares de equipamentos disponíveis em mais de 100
              cidades. Continuamos crescendo e inovando para servir melhor
              nossos clientes.
            </p>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default SobrePage;
