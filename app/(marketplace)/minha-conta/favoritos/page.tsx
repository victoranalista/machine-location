import { Suspense } from 'react';
import { getUserFavorites } from '../actions';
import { FavoritesClient } from './components/FavoritesClient';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata = {
  title: 'Meus Favoritos | EquipRent',
  description: 'Seus equipamentos favoritos salvos'
};

const FavoritesLoading = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <Skeleton key={i} className="h-32 w-full" />
    ))}
  </div>
);

const FavoritesContent = async () => {
  const favorites = await getUserFavorites();
  return <FavoritesClient favorites={favorites} />;
};

const FavoritosPage = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold">Meus Favoritos</h1>
      <p className="text-muted-foreground">
        Equipamentos salvos para alugar depois
      </p>
    </div>
    <Suspense fallback={<FavoritesLoading />}>
      <FavoritesContent />
    </Suspense>
  </div>
);

export default FavoritosPage;
