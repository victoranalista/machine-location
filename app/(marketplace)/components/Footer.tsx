import Link from 'next/link';
import { Truck, Mail, Phone, MapPin } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const footerLinks = {
  equipamentos: [
    { href: '/equipamentos?categoria=escavadeiras', label: 'Escavadeiras' },
    {
      href: '/equipamentos?categoria=retroescavadeiras',
      label: 'Retroescavadeiras'
    },
    { href: '/equipamentos?categoria=tratores', label: 'Tratores' },
    { href: '/equipamentos?categoria=guindastes', label: 'Guindastes' },
    {
      href: '/equipamentos?categoria=plataformas-elevatorias',
      label: 'Plataformas'
    }
  ],
  empresa: [
    { href: '/sobre', label: 'Sobre Nós' },
    { href: '/areas-atendimento', label: 'Cobertura' },
    { href: '/fornecedor', label: 'Seja Fornecedor' },
    { href: '/contato', label: 'Contato' }
  ],
  suporte: [
    { href: '/faq', label: 'FAQ' },
    { href: '/termos', label: 'Termos de Uso' },
    { href: '/privacidade', label: 'Privacidade' },
    { href: '/ajuda', label: 'Central de Ajuda' }
  ]
};

const FooterSection = ({
  title,
  links
}: {
  title: string;
  links: { href: string; label: string }[];
}) => (
  <div className="space-y-4">
    <h3 className="text-sm font-semibold uppercase tracking-wider">{title}</h3>
    <ul className="space-y-2.5">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className="group inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="relative">
              {link.label}
              <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-foreground transition-all group-hover:w-full" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => (
  <footer className="border-t bg-muted/30">
    <div className="container mx-auto px-4">
      <div className="grid gap-8 py-12 md:grid-cols-2 lg:grid-cols-5 lg:gap-8">
        <div className="space-y-4 lg:col-span-2">
          <Link href="/" className="group inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
              <Truck className="h-5 w-5 text-background" />
            </div>
            <span className="text-xl font-bold tracking-tight">MaquinaLoc</span>
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            A plataforma mais completa para locação de máquinas pesadas e
            equipamentos de construção no Brasil.
          </p>
          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4 shrink-0" />
              <a
                href="mailto:contato@maquinaloc.com.br"
                className="hover:text-foreground transition-colors"
              >
                contato@maquinaloc.com.br
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4 shrink-0" />
              <a
                href="tel:+5511999999999"
                className="hover:text-foreground transition-colors"
              >
                (61) 99999-9999
              </a>
            </div>
          </div>
        </div>
        <FooterSection title="Equipamentos" links={footerLinks.equipamentos} />
        <FooterSection title="Empresa" links={footerLinks.empresa} />
        <FooterSection title="Suporte" links={footerLinks.suporte} />
      </div>
      <Separator />
      <div className="flex flex-col items-center justify-between gap-4 py-6 text-sm text-muted-foreground md:flex-row">
        <p>
          &copy; {new Date().getFullYear()} MaquinaLoc. Todos os direitos
          reservados.
        </p>
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          <Link
            href="/termos"
            className="hover:text-foreground transition-colors"
          >
            Termos
          </Link>
          <Link
            href="/privacidade"
            className="hover:text-foreground transition-colors"
          >
            Privacidade
          </Link>
          <Link
            href="/cookies"
            className="hover:text-foreground transition-colors"
          >
            Cookies
          </Link>
        </div>
      </div>
    </div>
  </footer>
);

export { Footer };
