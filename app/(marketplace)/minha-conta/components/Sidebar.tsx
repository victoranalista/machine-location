'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Package, Heart, User, LogOut, Settings } from 'lucide-react';

type SidebarProps = {
  user: { name: string; email: string };
};

const menuItems = [
  { href: '/minha-conta', label: 'Visão Geral', icon: User, exact: true },
  { href: '/minha-conta/locacoes', label: 'Minhas Locações', icon: Package },
  { href: '/minha-conta/favoritos', label: 'Favoritos', icon: Heart },
  { href: '/minha-conta/configuracoes', label: 'Configurações', icon: Settings }
];

const Sidebar = ({ user }: SidebarProps) => {
  const pathname = usePathname();
  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  const handleSignOut = () => signOut({ callbackUrl: '/' });
  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-6 flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="overflow-hidden">
            <p className="truncate font-semibold">{user.name}</p>
            <p className="truncate text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
        <Separator className="mb-4" />
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start',
                    isActive && 'bg-secondary'
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>
        <Separator className="my-4" />
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </CardContent>
    </Card>
  );
};

export { Sidebar };
