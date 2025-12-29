import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Truck, Menu, User, ChevronDown } from 'lucide-react';
import { auth } from '@/lib/auth/auth';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet';
import { getCartCount } from '../carrinho/actions';
import DarkMode from '@/components/DarkMode';
import { HeaderSearch } from './HeaderSearch';
import { HeaderCart } from './HeaderCart';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import { Separator } from '@/components/ui/separator';

const equipmentCategories = [
  {
    href: '/equipamentos?categoria=escavadeiras',
    label: 'Escavadeiras',
    icon: '🚜'
  },
  {
    href: '/equipamentos?categoria=retroescavadeiras',
    label: 'Retroescavadeiras',
    icon: '🏗️'
  },
  { href: '/equipamentos?categoria=tratores', label: 'Tratores', icon: '🚜' },
  {
    href: '/equipamentos?categoria=guindastes',
    label: 'Guindastes',
    icon: '🏗️'
  },
  {
    href: '/equipamentos?categoria=empilhadeiras',
    label: 'Empilhadeiras',
    icon: '🏭'
  },
  {
    href: '/equipamentos?categoria=compactadores',
    label: 'Compactadores',
    icon: '🚧'
  }
];

const Logo = () => (
  <Link href="/" className="group flex items-center gap-2">
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
      <Truck className="h-5 w-5 text-background" />
    </div>
    <span className="hidden text-xl font-bold tracking-tight sm:block">
      MaquinaLoc
    </span>
  </Link>
);

const DesktopNav = () => (
  <NavigationMenu className="hidden lg:flex">
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuTrigger className="gap-1">
          Equipamentos
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <div className="grid w-[500px] gap-3 p-4 md:grid-cols-2">
            <div className="row-span-3">
              <Link
                href="/equipamentos"
                className="flex h-full flex-col justify-end rounded-lg bg-gradient-to-br from-muted to-muted/50 p-6 no-underline outline-none transition-all hover:shadow-md focus:shadow-md"
              >
                <div className="mb-2 text-3xl">🚜</div>
                <div className="mb-2 text-lg font-semibold">
                  Todos Equipamentos
                </div>
                <p className="text-sm leading-tight text-muted-foreground">
                  Navegue por todo nosso catálogo
                </p>
              </Link>
            </div>
            {equipmentCategories.slice(0, 5).map((category) => (
              <Link
                key={category.href}
                href={category.href}
                className="group block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{category.icon}</span>
                  <div className="text-sm font-medium leading-none">
                    {category.label}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </NavigationMenuContent>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
          <Link href="/areas-atendimento">Cobertura</Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
          <Link href="/sobre">Sobre</Link>
        </NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
);

const MobileMenu = () => (
  <Sheet>
    <SheetTrigger asChild>
      <Button variant="ghost" size="icon" className="lg:hidden">
        <Menu className="h-5 w-5" />
      </Button>
    </SheetTrigger>
    <SheetContent side="left" className="w-[300px] sm:w-[350px]">
      <div className="flex flex-col gap-6 pt-6">
        <Logo />
        <Separator />
        <nav className="flex flex-col gap-4">
          <div>
            <h4 className="mb-3 text-sm font-semibold text-muted-foreground">
              CATEGORIAS
            </h4>
            <div className="space-y-1">
              {equipmentCategories.map((category) => (
                <SheetClose asChild key={category.href}>
                  <Link
                    href={category.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
                  >
                    <span className="text-lg">{category.icon}</span>
                    {category.label}
                  </Link>
                </SheetClose>
              ))}
            </div>
          </div>
          <Separator />
          <div className="space-y-1">
            <SheetClose asChild>
              <Link
                href="/areas-atendimento"
                className="block rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
              >
                Áreas de Atendimento
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                href="/sobre"
                className="block rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
              >
                Sobre Nós
              </Link>
            </SheetClose>
          </div>
        </nav>
      </div>
    </SheetContent>
  </Sheet>
);

const Header = async () => {
  const session = await auth();
  const cartCount = await getCartCount();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-2">
          <div className="flex items-center gap-3 md:gap-6">
            <MobileMenu />
            <Logo />
            <DesktopNav />
          </div>
          <div className="flex items-center gap-1">
            <div className="hidden md:block">
              <HeaderSearch />
            </div>
            <HeaderCart count={cartCount} />
            <DarkMode />
            {session?.user ? (
              <Button asChild variant="ghost" size="icon">
                <Link href="/minha-conta">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <Button asChild size="sm" className="hidden sm:flex">
                <Link href="/login">Entrar</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export { Header };
