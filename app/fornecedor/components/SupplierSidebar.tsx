'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Package,
  Calendar,
  BarChart3,
  Settings,
  Truck
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const navigation = [
  { href: '/fornecedor', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/fornecedor/equipamentos', label: 'Equipamentos', icon: Package },
  { href: '/fornecedor/locacoes', label: 'Locações', icon: Calendar },
  { href: '/fornecedor/analise', label: 'Análise', icon: BarChart3 },
  { href: '/fornecedor/configuracoes', label: 'Configurações', icon: Settings }
];

export const SupplierSidebar = () => {
  const pathname = usePathname();
  return (
    <aside className="hidden w-64 border-r bg-card lg:block">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Truck className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold">Portal do</p>
            <p className="text-sm font-bold text-primary">Fornecedor</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Separator />
        <div className="p-4">
          <div className="rounded-lg bg-muted p-4">
            <p className="text-xs font-medium text-muted-foreground">
              Precisa de ajuda?
            </p>
            <p className="mt-1 text-sm font-semibold">Suporte 24/7</p>
            <Link
              href="/fornecedor/suporte"
              className="mt-2 inline-flex text-xs text-primary hover:underline"
            >
              Falar com suporte →
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
};
