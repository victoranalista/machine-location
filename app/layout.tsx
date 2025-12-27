import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import Providers from './providers';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MaquinaLoc - Marketplace de Locação de Máquinas Pesadas',
  description:
    'Alugue máquinas pesadas e equipamentos de construção de forma rápida, segura e com os melhores preços. Escavadeiras, tratores, guindastes e mais.'
};

const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <html lang="pt-BR" suppressHydrationWarning>
    <body className="overflow-x-hidden">
      <Providers>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Toaster />
      </Providers>
    </body>
  </html>
);

export default RootLayout;
