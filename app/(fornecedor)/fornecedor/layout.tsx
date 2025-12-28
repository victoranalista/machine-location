import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import { FornecedorSidebar } from './components/FornecedorSidebar';

type FornecedorLayoutProps = {
  children: React.ReactNode;
};

const FornecedorLayout = async ({ children }: FornecedorLayoutProps) => {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }
  return (
    <div className="flex h-screen">
      <FornecedorSidebar />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  );
};

export default FornecedorLayout;
