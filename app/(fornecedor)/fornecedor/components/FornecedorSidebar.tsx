'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  FileText,
  Settings,
  ChevronLeft,
  HardHat
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';

const navItems = [
  { label: 'Dashboard', href: '/fornecedor', icon: LayoutDashboard },
  {
    label: 'Meus Equipamentos',
    href: '/fornecedor/equipamentos',
    icon: Package
  },
  { label: 'Locações', href: '/fornecedor/locacoes', icon: FileText },
  { label: 'Configurações', href: '/fornecedor/configuracoes', icon: Settings }
];

export const FornecedorSidebar = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  return (
    <aside
      className={cn(
        'relative flex flex-col border-r bg-card transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!collapsed && (
          <Link
            href="/fornecedor"
            className="flex items-center gap-2 font-bold"
          >
            <HardHat className="h-6 w-6 text-primary" />
            <span>Fornecedor</span>
          </Link>
        )}
        {collapsed && (
          <Link href="/fornecedor" className="mx-auto">
            <HardHat className="h-6 w-6 text-primary" />
          </Link>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-3 top-20 z-10 h-6 w-6 rounded-full border bg-background shadow-sm"
        onClick={() => setCollapsed(!collapsed)}
      >
        <ChevronLeft
          className={cn(
            'h-4 w-4 transition-transform',
            collapsed && 'rotate-180'
          )}
        />
      </Button>
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/fornecedor' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  collapsed && 'justify-center'
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
    </aside>
  );
};
