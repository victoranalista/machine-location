import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { Home, Menu } from 'lucide-react';
import { NavItem } from './nav-item';
import Tabs from './Tabs';
import Image from 'next/image';
import Providers from '../providers';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import DarkMode from '@/components/DarkMode';
import { requireSession } from '@/lib/auth/requireSession';
import { Role } from '@/prisma/generated/prisma/client';

const labelsAndLinks = {
  home: {
    label: 'Home',
    link: '/dashboard'
  }
};

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const user = await requireSession([Role.ADMIN]);
  return (
    <Providers>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <DesktopNav role={user.role} />
        <div className="flex flex-1 flex-col overflow-hidden min-w-0 sm:pl-14">
          <header className="sticky top-0 z-30 flex h-14 items-center border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 justify-between flex-shrink-0">
            <MobileNav role={user.role} />
            <div className="ml-auto flex items-center gap-4">
              <DarkMode />
            </div>
          </header>
          <main className="flex flex-col flex-1 min-h-0 gap-2 p-4 sm:px-6 sm:py-0 md:gap-4 overflow-y-auto">
            <Tabs defaultValue="users">{children}</Tabs>
          </main>
        </div>
      </div>
    </Providers>
  );
}

const DesktopNav = (props: { role?: Role }) => {
  const { role } = props;
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-2 sm:py-5">
        <Image
          src="/images/logo.png"
          alt="Impetus Energy"
          width={45}
          height={45}
          className="transition-all group-hover:scale-110"
        />
        <NavItem
          href={labelsAndLinks.home.link}
          label={labelsAndLinks.home.label}
        >
          <Home className="h-5 w-5" />
        </NavItem>
        <span className="sr-only">Impetus Energy</span>
      </nav>
    </aside>
  );
};

const MobileNav = (props: { role?: Role }) => {
  const { role } = props;
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <SheetHeader>
          <VisuallyHidden>
            <SheetTitle>Menu</SheetTitle>
          </VisuallyHidden>
        </SheetHeader>
        <nav className="grid gap-6 text-lg font-medium">
          <Image
            src="/images/logo.png"
            alt="Impetus Energy"
            width={32}
            height={32}
            className="transition-all group-hover:scale-110 dark:invert"
          />
        </nav>
      </SheetContent>
    </Sheet>
  );
};
