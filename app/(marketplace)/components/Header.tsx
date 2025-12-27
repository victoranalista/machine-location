import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Truck, Menu, X, Search, ShoppingCart, User } from 'lucide-react';
import { auth } from '@/lib/auth/auth';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { getCartCount } from '../carrinho/actions';
import { DarkMode } from '@/components/DarkMode';
import { HeaderSearch } from './HeaderSearch';
import { HeaderCart } from './HeaderCart';

const navLinks = [
  { href: '/equipamentos', label: 'Equipamentos' },
  { href: '/categorias', label: 'Categorias' },
  { href: '/locais', label: 'Localizações' },
  { href: '/como-funciona', label: 'Como Funciona' }
];

const NavLinks = ({
  className,
  onClick
}: {
  className?: string;
  onClick?: () => void;
}) => (
  <nav className={cn('flex items-center gap-1', className)}>
    {navLinks.map((link) => (
      <Link
        key={link.href}
        href={link.href}
        onClick={onClick}
        className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        {link.label}
      </Link>
    ))}
  </nav>
);

const Logo = () => (
  <Link href="/" className="flex items-center gap-2">
    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
      <Truck className="h-5 w-5 text-primary-foreground" />
    </div>
    <span className="text-xl font-bold tracking-tight">MaquinaLoc</span>
  </Link>
);

const MobileMenu = () => (
  <Sheet>
    <SheetTrigger asChild>
      <Button variant="ghost" size="icon" className="lg:hidden">
        <Menu className="h-5 w-5" />
      </Button>
    </SheetTrigger>
    <SheetContent side="left" className="w-72">
      <div className="flex flex-col gap-6 pt-6">
        <Logo />
        <NavLinks className="flex-col items-start gap-0" />
        <div className="border-t pt-4">
          <Link href="/login">
            <Button className="w-full">Entrar</Button>
          </Link>
        </div>
      </div>
    </SheetContent>
  </Sheet>
);

const Header = async () => {
  const session = await auth();
  const cartCount = await getCartCount();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <MobileMenu />
          <Logo />
          <NavLinks className="hidden lg:flex" />
        </div>
        <div className="flex items-center gap-2">
          <HeaderSearch />
          <HeaderCart count={cartCount} />
          <DarkMode />
          {session?.user ? (
            <Link href="/minha-conta">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <Link href="/login" className="hidden sm:block">
              <Button>Entrar</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export { Header };
