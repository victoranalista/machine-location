import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminHeader } from './components/AdminHeader';

type AdminLayoutProps = {
  children: React.ReactNode;
};

const AdminLayout = async ({ children }: AdminLayoutProps) => {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // Verificar se é admin (assumindo que há um campo role no user)
  // if (session.user.role !== 'ADMIN') {
  //   redirect('/minha-conta');
  // }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminHeader user={session.user} />
        <main className="flex-1 bg-muted/30 p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
