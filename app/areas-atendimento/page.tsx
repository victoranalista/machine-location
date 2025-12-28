import { MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Header } from '../(marketplace)/components/Header';
import { Footer } from '../(marketplace)/components/Footer';

const regions = [
  {
    region: 'Sudeste',
    cities: [
      { name: 'São Paulo', state: 'SP', count: 1250 },
      { name: 'Rio de Janeiro', state: 'RJ', count: 890 },
      { name: 'Belo Horizonte', state: 'MG', count: 650 },
      { name: 'Campinas', state: 'SP', count: 420 },
      { name: 'Guarulhos', state: 'SP', count: 380 },
      { name: 'Vitória', state: 'ES', count: 290 }
    ]
  },
  {
    region: 'Sul',
    cities: [
      { name: 'Curitiba', state: 'PR', count: 480 },
      { name: 'Porto Alegre', state: 'RS', count: 430 },
      { name: 'Florianópolis', state: 'SC', count: 320 },
      { name: 'Joinville', state: 'SC', count: 280 },
      { name: 'Londrina', state: 'PR', count: 250 }
    ]
  },
  {
    region: 'Nordeste',
    cities: [
      { name: 'Salvador', state: 'BA', count: 380 },
      { name: 'Recife', state: 'PE', count: 340 },
      { name: 'Fortaleza', state: 'CE', count: 310 },
      { name: 'João Pessoa', state: 'PB', count: 220 },
      { name: 'Natal', state: 'RN', count: 200 }
    ]
  },
  {
    region: 'Centro-Oeste',
    cities: [
      { name: 'Brasília', state: 'DF', count: 520 },
      { name: 'Goiânia', state: 'GO', count: 310 },
      { name: 'Campo Grande', state: 'MS', count: 240 },
      { name: 'Cuiabá', state: 'MT', count: 210 }
    ]
  },
  {
    region: 'Norte',
    cities: [
      { name: 'Manaus', state: 'AM', count: 280 },
      { name: 'Belém', state: 'PA', count: 250 },
      { name: 'Porto Velho', state: 'RO', count: 180 },
      { name: 'Palmas', state: 'TO', count: 150 }
    ]
  }
];

const AreasAtendimentoPage = () => (
  <div className="flex min-h-screen flex-col">
    <Header />
    <main className="flex-1">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight">
            Áreas de Atendimento
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Atendemos mais de 100 cidades em todo o Brasil com equipamentos de
            qualidade e fornecedores verificados
          </p>
        </div>
        <div className="space-y-12">
          {regions.map((region) => (
            <div key={region.region}>
              <h2 className="mb-6 text-2xl font-bold">{region.region}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {region.cities.map((city) => (
                  <Link
                    key={`${city.name}-${city.state}`}
                    href={`/equipamentos?cidade=${city.name}`}
                  >
                    <Card className="group transition-all hover:shadow-lg hover:-translate-y-1">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold group-hover:text-primary transition-colors">
                              {city.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {city.state}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {city.count} equipamentos disponíveis
                            </p>
                          </div>
                          <MapPin className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default AreasAtendimentoPage;
