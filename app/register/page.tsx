import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import DarkMode from '@/components/DarkMode';
import Link from 'next/link';
import { HardHat } from 'lucide-react';
import { RegisterForm } from './RegisterForm';

export const metadata = {
  title: 'Criar Conta | EquipRent',
  description: 'Crie sua conta para alugar equipamentos pesados'
};

const RegisterPage = () => (
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
            <CardTitle className="text-2xl">Criar Conta</CardTitle>
            <CardDescription>
              Cadastre-se para alugar equipamentos pesados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground text-center">
              Já tem uma conta?{' '}
              <Link href="/login" className="text-primary hover:underline">
                Fazer login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  </div>
);

export default RegisterPage;
