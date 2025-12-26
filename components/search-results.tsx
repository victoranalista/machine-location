"use client";

import { useState, useTransition } from "react";
import { Machine } from "@/lib/types";
import { searchMachines } from "@/actions/machines";
import { SearchBar } from "@/components/search-bar";
import { MachineList } from "@/components/machine-list";

interface SearchResultsProps {
  initialMachines: Machine[];
  categories: string[];
  locations: string[];
}

export function SearchResults({
  initialMachines,
  categories,
  locations,
}: SearchResultsProps) {
  const [machines, setMachines] = useState<Machine[]>(initialMachines);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (filters: {
    query: string;
    category: string;
    location: string;
    sortBy: string;
  }) => {
    startTransition(async () => {
      const results = await searchMachines({
        query: filters.query,
        category: filters.category,
        location: filters.location,
        sortBy: filters.sortBy as any,
      });
      setMachines(results);
    });
  };

  return (
    <div className="space-y-8">
      <SearchBar
        onSearch={handleSearch}
        categories={categories}
        locations={locations}
      />

      {isPending ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-sm text-muted-foreground">Buscando...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {machines.length} equipamento(s) encontrado(s)
            </p>
          </div>
          <MachineList machines={machines} />
        </>
      )}
    </div>
  );
}
