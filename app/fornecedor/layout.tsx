import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import { SupplierSidebar } from './components/MobileSidebar';
import { SupplierHeader } from './components/SupplierHeader';

type SupplierLayoutProps = {
  children: React.ReactNode;
};

const SupplierLayout = async ({ children }: SupplierLayoutProps) => {
  const session = await auth();
  if (!session?.user?.email) redirect('/login');
  if (session.user.role !== 'SUPPLIER') redirect('/login/unauthorized');
  return (
    <div className="flex min-h-screen bg-muted/30">
      <SupplierSidebar />
      <div className="flex flex-1 flex-col">
        <SupplierHeader />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default SupplierLayout;
