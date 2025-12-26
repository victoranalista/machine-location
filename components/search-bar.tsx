"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface SearchBarProps {
  onSearch: (filters: {
    query: string;
    category: string;
    location: string;
    sortBy: string;
  }) => void;
  categories: string[];
  locations: string[];
}

export function SearchBar({ onSearch, categories, locations }: SearchBarProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSearch({
      query: formData.get("query") as string,
      category: formData.get("category") as string,
      location: formData.get("location") as string,
      sortBy: formData.get("sortBy") as string,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-end">
        <div className="flex-1 space-y-2">
          <Label htmlFor="query">Buscar Equipamento</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="query"
              name="query"
              type="text"
              placeholder="Digite o nome, modelo ou categoria..."
              className="pl-9"
            />
          </div>
        </div>

        <div className="w-full space-y-2 md:w-48">
          <Label htmlFor="category">Categoria</Label>
          <Select name="category" defaultValue="all">
            <SelectTrigger id="category">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas Categorias</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full space-y-2 md:w-48">
          <Label htmlFor="location">Localização</Label>
          <Select name="location" defaultValue="all">
            <SelectTrigger id="location">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas Localizações</SelectItem>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-full space-y-2 md:w-48">
          <Label htmlFor="sortBy">Ordenar por</Label>
          <Select name="sortBy" defaultValue="default">
            <SelectTrigger id="sortBy">
              <SelectValue placeholder="Ordenar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Recomendados</SelectItem>
              <SelectItem value="price-asc">Menor Preço</SelectItem>
              <SelectItem value="price-desc">Maior Preço</SelectItem>
              <SelectItem value="rating">Melhor Avaliação</SelectItem>
              <SelectItem value="name">Nome A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full md:w-auto">
          <Search className="mr-2 h-4 w-4" />
          Buscar
        </Button>
      </div>
    </form>
  );
}
