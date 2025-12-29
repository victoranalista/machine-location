'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Package, Heart, User, LogOut, Settings, Menu } from 'lucide-react';
import { useState } from 'react';

type MobileSidebarProps = {
  user: { name: string; email: string };
};

const menuItems = [
  { href: '/minha-conta', label: 'Visão Geral', icon: User, exact: true },
  { href: '/minha-conta/locacoes', label: 'Minhas Locações', icon: Package },
  { href: '/minha-conta/favoritos', label: 'Favoritos', icon: Heart },
  { href: '/minha-conta/configuracoes', label: 'Configurações', icon: Settings }
];

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
};

const UserProfile = ({ user }: { user: { name: string; email: string } }) => (
  <div className="flex items-center gap-4">
    <Avatar className="h-12 w-12">
      <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
    </Avatar>
    <div className="min-w-0 flex-1">
      <p className="truncate font-semibold">{user.name}</p>
      <p className="truncate text-sm text-muted-foreground">{user.email}</p>
    </div>
  </div>
);

const MenuItem = ({
  item,
  isActive,
  onClick
}: {
  item: (typeof menuItems)[0];
  isActive: boolean;
  onClick: () => void;
}) => (
  <Link href={item.href} onClick={onClick}>
    <Button
      variant={isActive ? 'secondary' : 'ghost'}
      className={cn('w-full justify-start', isActive && 'bg-secondary')}
    >
      <item.icon className="mr-2 h-4 w-4" />
      {item.label}
    </Button>
  </Link>
);

const MobileSidebar = ({ user }: MobileSidebarProps) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const handleSignOut = () => {
    setOpen(false);
    signOut({ callbackUrl: '/' });
  };
  const handleLinkClick = () => setOpen(false);
  const isItemActive = (item: (typeof menuItems)[0]) => {
    return item.exact ? pathname === item.href : pathname.startsWith(item.href);
  };
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-start">
          <Menu className="mr-2 h-4 w-4" />
          Menu
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[320px]">
        <div className="flex flex-col gap-6 py-4">
          <UserProfile user={user} />
          <Separator />
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <MenuItem
                key={item.href}
                item={item}
                isActive={isItemActive(item)}
                onClick={handleLinkClick}
              />
            ))}
          </nav>
          <Separator />
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export { MobileSidebar };
