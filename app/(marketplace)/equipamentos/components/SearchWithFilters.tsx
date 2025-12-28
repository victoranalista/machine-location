'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import estadosData from '@/lib/estados.json';
import { categories } from '../data/equipment-data';

const estados = Object.values(estadosData);

const brasilCidades = [
  { nome: 'São Paulo', estado: 'SP' },
  { nome: 'Rio de Janeiro', estado: 'RJ' },
  { nome: 'Belo Horizonte', estado: 'MG' },
  { nome: 'Brasília', estado: 'DF' },
  { nome: 'Curitiba', estado: 'PR' },
  { nome: 'Porto Alegre', estado: 'RS' },
  { nome: 'Salvador', estado: 'BA' },
  { nome: 'Recife', estado: 'PE' },
  { nome: 'Fortaleza', estado: 'CE' },
  { nome: 'Manaus', estado: 'AM' },
  { nome: 'Belém', estado: 'PA' },
  { nome: 'Goiânia', estado: 'GO' },
  { nome: 'Campinas', estado: 'SP' },
  { nome: 'São Bernardo do Campo', estado: 'SP' },
  { nome: 'Guarulhos', estado: 'SP' },
  { nome: 'Vitória', estado: 'ES' },
  { nome: 'Florianópolis', estado: 'SC' },
  { nome: 'Natal', estado: 'RN' },
  { nome: 'João Pessoa', estado: 'PB' },
  { nome: 'Maceió', estado: 'AL' }
];

type SearchWithFiltersProps = {
  initialSearch?: string;
  initialCity?: string;
};

const SearchWithFilters = ({
  initialSearch = '',
  initialCity = ''
}: SearchWithFiltersProps) => {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [city, setCity] = useState(initialCity);
  const [cityOpen, setCityOpen] = useState(false);
  const filteredCities = useMemo(() => {
    if (!city) return brasilCidades.slice(0, 10);
    return brasilCidades.filter((c) =>
      c.nome.toLowerCase().includes(city.toLowerCase())
    );
  }, [city]);
  const findMatchingCategory = (term: string) => {
    const search = term.toLowerCase().trim();
    if (!search) return null;
    return categories.find(
      (cat) =>
        cat.name.toLowerCase().includes(search) ||
        search.includes(cat.name.toLowerCase())
    );
  };
  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (city.trim()) params.set('cidade', city.trim());
    const matchedCategory = findMatchingCategory(search);
    if (matchedCategory) params.set('categoria', matchedCategory.slug);
    router.push(`/equipamentos?${params.toString()}`);
  };
  const handleClear = () => {
    setSearch('');
    setCity('');
    router.push('/equipamentos');
  };
  const hasFilters = search || city;
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <Label htmlFor="search" className="sr-only">
            Buscar equipamento
          </Label>
          <Input
            id="search"
            placeholder="Ex: Escavadeira, Trator, Guindaste..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="h-11"
          />
        </div>
        <Popover open={cityOpen} onOpenChange={setCityOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-11 justify-start gap-2 sm:w-[240px]"
            >
              <MapPin className="h-4 w-4 shrink-0" />
              <span className="truncate">{city || 'Cidade'}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[280px] p-0" align="start">
            <Command>
              <CommandInput
                placeholder="Digite a cidade..."
                value={city}
                onValueChange={setCity}
              />
              <CommandList>
                <CommandEmpty>Nenhuma cidade encontrada</CommandEmpty>
                <CommandGroup>
                  {filteredCities.map((c) => (
                    <CommandItem
                      key={`${c.nome}-${c.estado}`}
                      value={c.nome}
                      onSelect={(value) => {
                        setCity(value);
                        setCityOpen(false);
                      }}
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      {c.nome} - {c.estado}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Button onClick={handleSearch} size="lg" className="gap-2">
          <Search className="h-4 w-4" />
          Buscar
        </Button>
      </div>
      {hasFilters && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Filtros ativos:</span>
          {search && (
            <Badge variant="secondary" className="gap-1">
              {search}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setSearch('')}
              />
            </Badge>
          )}
          {city && (
            <Badge variant="secondary" className="gap-1">
              {city}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setCity('')}
              />
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={handleClear}>
            Limpar tudo
          </Button>
        </div>
      )}
    </div>
  );
};

export { SearchWithFilters };
