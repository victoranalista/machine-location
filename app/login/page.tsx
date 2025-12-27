import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import DarkMode from '@/components/DarkMode';
import AuthActions from './authActions';
import Link from 'next/link';
import { HardHat } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen relative flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <HardHat className="h-6 w-6 text-primary" />
          EquipRent
        </Link>
        <DarkMode />
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom duration-500">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Bem-vindo de volta</CardTitle>
              <CardDescription>
                Entre na sua conta para gerenciar suas locações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <AuthActions />
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground text-center">
                Não tem uma conta?{' '}
                <Link href="/register" className="text-primary hover:underline">
                  Criar conta
                </Link>
              </p>
              <p className="text-xs text-muted-foreground text-center">
                Ao continuar, você concorda com nossos{' '}
                <Link
                  href="/termos"
                  className="underline hover:text-foreground"
                >
                  Termos de Serviço
                </Link>{' '}
                e{' '}
                <Link
                  href="/privacidade"
                  className="underline hover:text-foreground"
                >
                  Política de Privacidade
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}
