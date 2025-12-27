import { Suspense } from 'react';
import { getAdminCategories } from '../actions';
import { CategoriesTable } from './components/CategoriesTable';
import { CategoryHeader } from './components/CategoryHeader';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata = {
  title: 'Categorias | Admin',
  description: 'Gerenciamento de categorias'
};

const TableLoading = () => (
  <div className="space-y-4">
    <Skeleton className="h-10 w-full" />
    {[1, 2, 3, 4].map((i) => (
      <Skeleton key={i} className="h-16 w-full" />
    ))}
  </div>
);

const CategoriesContent = async () => {
  const categories = await getAdminCategories();
  return <CategoriesTable categories={categories} />;
};

const AdminCategoriasPage = () => (
  <div className="space-y-6">
    <CategoryHeader />
    <Suspense fallback={<TableLoading />}>
      <CategoriesContent />
    </Suspense>
  </div>
);

export default AdminCategoriasPage;
