import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Machine Location - Locação de Máquinas Pesadas",
  description: "Plataforma moderna para locação de máquinas e equipamentos de construção",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="font-sans antialiased">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center">
            <div className="flex gap-6 md:gap-10">
              <a href="/" className="flex items-center space-x-2">
                <span className="text-xl font-bold">Machine Location</span>
              </a>
            </div>
          </div>
        </header>
        <main>{children}</main>
        <footer className="mt-auto border-t py-6 md:py-8">
          <div className="container text-center text-sm text-muted-foreground">
            © 2024 Machine Location. Todos os direitos reservados.
          </div>
        </footer>
      </body>
    </html>
  );
}
