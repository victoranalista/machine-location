import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import { Sidebar } from './components/Sidebar';
import { MobileSidebar } from './components/MobileSidebar';

type LayoutProps = {
  children: React.ReactNode;
};

const MinhaContaLayout = async ({ children }: LayoutProps) => {
  const session = await auth();
  if (!session?.user) redirect('/login?callbackUrl=/minha-conta');
  const user = {
    name: session.user.name ?? '',
    email: session.user.email ?? ''
  };
  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <div className="mb-6 lg:hidden">
        <MobileSidebar user={user} />
      </div>
      <div className="grid gap-6 lg:grid-cols-[280px_1fr] lg:gap-8">
        <aside className="hidden lg:block">
          <Sidebar user={user} />
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
};

export default MinhaContaLayout;
