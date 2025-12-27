import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import { Sidebar } from './components/Sidebar';

type LayoutProps = {
  children: React.ReactNode;
};

const MinhaContaLayout = async ({ children }: LayoutProps) => {
  const session = await auth();
  if (!session?.user) redirect('/login?callbackUrl=/minha-conta');
  return (
    <div className="container py-8">
      <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
        <aside className="hidden lg:block">
          <Sidebar
            user={{
              name: session.user.name ?? '',
              email: session.user.email ?? ''
            }}
          />
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
};

export default MinhaContaLayout;
