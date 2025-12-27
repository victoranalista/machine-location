import Link from 'next/link';
import { Truck } from 'lucide-react';

const footerLinks = {
  equipamentos: [
    { href: '/equipamentos?category=escavadeiras', label: 'Escavadeiras' },
    {
      href: '/equipamentos?category=retroescavadeiras',
      label: 'Retroescavadeiras'
    },
    { href: '/equipamentos?category=tratores', label: 'Tratores' },
    { href: '/equipamentos?category=guindastes', label: 'Guindastes' },
    {
      href: '/equipamentos?category=plataformas-elevatorias',
      label: 'Plataformas Elevatórias'
    }
  ],
  empresa: [
    { href: '/sobre', label: 'Sobre Nós' },
    { href: '/como-funciona', label: 'Como Funciona' },
    { href: '/parceiros', label: 'Seja um Parceiro' },
    { href: '/carreiras', label: 'Carreiras' }
  ],
  suporte: [
    { href: '/faq', label: 'Perguntas Frequentes' },
    { href: '/contato', label: 'Contato' },
    { href: '/termos', label: 'Termos de Uso' },
    { href: '/privacidade', label: 'Política de Privacidade' }
  ]
};

const FooterSection = ({
  title,
  links
}: {
  title: string;
  links: { href: string; label: string }[];
}) => (
  <div>
    <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
      {title}
    </h3>
    <ul className="space-y-3">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => (
  <footer className="border-t bg-muted/30">
    <div className="container py-12">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Truck className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">MaquinaLoc</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            A plataforma mais completa para locação de máquinas pesadas e
            equipamentos de construção no Brasil.
          </p>
        </div>
        <FooterSection title="Equipamentos" links={footerLinks.equipamentos} />
        <FooterSection title="Empresa" links={footerLinks.empresa} />
        <FooterSection title="Suporte" links={footerLinks.suporte} />
      </div>
      <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()} MaquinaLoc. Todos os direitos
          reservados.
        </p>
      </div>
    </div>
  </footer>
);

export { Footer };
