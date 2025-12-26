import { searchMachines, getCategories, getLocations } from "@/actions/machines";
import { SearchResults } from "@/components/search-results";

export default async function Home() {
  const [initialMachines, categories, locations] = await Promise.all([
    searchMachines(),
    getCategories(),
    getLocations(),
  ]);

  return (
    <div className="container py-8 md:py-12">
      <div className="mb-8 space-y-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Locação de Máquinas Pesadas
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Encontre o equipamento perfeito para sua obra. Escavadeiras, tratores,
          guindastes e muito mais.
        </p>
      </div>

      <SearchResults
        initialMachines={initialMachines}
        categories={categories}
        locations={locations}
      />
    </div>
  );
}
