'use client';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  Home,
  LogOut,
  Settings,
  User,
  FolderKanban,
  HardHat
} from 'lucide-react';
import DarkMode from '@/components/DarkMode';
import { useCallback, useMemo } from 'react';
import { NavItem } from '@/app/settings/nav-item';
import { useSession } from '@/lib/hooks/use-session';
import { handleSignOut } from '../app/login/actions';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  roles?: string[];
}

const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    id: 'home',
    label: 'Início',
    icon: Home,
    path: '/dashboard'
  },
  {
    id: 'projects',
    label: 'Projetos',
    icon: FolderKanban,
    path: '/dashboard/projects',
    roles: ['ADMIN']
  },
  {
    id: 'field',
    label: 'Campo',
    icon: HardHat,
    path: '/dashboard/field'
  },
  {
    id: 'settings',
    label: 'Configurações',
    icon: Settings,
    path: '/settings',
    roles: ['ADMIN']
  }
];

const SidebarNavigation = () => {
  const { user } = useSession();
  const filteredItems = NAVIGATION_ITEMS.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(user?.role ?? '');
  });

  return (
    <TooltipProvider>
      <aside className="flex h-full w-14 flex-col border-r bg-background">
        <div className="flex h-14 items-center justify-center border-b px-2">
          <img
            src="/images/logo.png"
            alt="Impetus Energy"
            width={45}
            height={45}
            className="transition-all group-hover:scale-110"
          />
        </div>

        <nav className="flex flex-1 flex-col items-center gap-2 p-2">
          {filteredItems.map((item) => (
            <NavItem
              key={item.id}
              href={item.path}
              label={item.label}
              variant="ghost"
            >
              <item.icon className="h-5 w-5" />
            </NavItem>
          ))}
        </nav>
      </aside>
    </TooltipProvider>
  );
};

const getBreadcrumbs = (pathname: string) => {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [];

  for (let i = 0; i < segments.length; i++) {
    const path = `/${segments.slice(0, i + 1).join('/')}`;
    const segment = segments[i];

    const labels: Record<string, string> = {
      dashboard: 'Dashboard',
      projects: 'Projetos',
      field: 'Campo',
      settings: 'Configurações',
      new: 'Novo',
      users: 'Usuários'
    };

    const label = segment ? labels[segment] || segment : segment;
    breadcrumbs.push({ label, path, isLast: i === segments.length - 1 });
  }

  return breadcrumbs;
};

const TopBar = ({ onLogout }: { onLogout: () => void }) => {
  const { user, isLoading } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => getBreadcrumbs(pathname), [pathname]);

  const getUserInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSettingsClick = useCallback(() => {
    router.push('/settings');
  }, [router]);

  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-4 md:px-6">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.flatMap((crumb, index) => {
            const items = [];
            if (index > 0) {
              items.push(<BreadcrumbSeparator key={`sep-${crumb.path}`} />);
            }
            items.push(
              <BreadcrumbItem key={crumb.path}>
                {crumb.isLast ? (
                  <BreadcrumbPage className="font-semibold">
                    {crumb.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={crumb.path}>
                    {crumb.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            );
            return items;
          })}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-3">
        <DarkMode />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={user?.image || '/placeholder-user.jpg'}
                  alt={user?.name || 'Usuário'}
                />
                <AvatarFallback>
                  {isLoading ? (
                    <User className="h-4 w-4" />
                  ) : (
                    getUserInitials(user?.name)
                  )}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.name || 'Usuário'}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {user?.role === 'ADMIN' && (
              <>
                <DropdownMenuItem onClick={handleSettingsClick}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem onClick={onLogout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isLoading } = useSession();

  const handleLogout = useCallback(async () => {
    try {
      await handleSignOut();
      router.push('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      router.push('/login');
    }
  }, [router]);
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <SidebarNavigation />
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <TopBar onLogout={handleLogout} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
