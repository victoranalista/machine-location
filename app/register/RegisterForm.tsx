'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Loader2, User, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { registerUser } from './actions';

const RegisterForm = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const [accountType, setAccountType] = useState<'USER' | 'SUPPLIER'>('USER');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    startTransition(async () => {
      const result = await registerUser({
        name,
        email,
        password,
        role: accountType
      });
      if (result.success) {
        toast.success('Conta criada com sucesso! Faça login para continuar.');
        router.push('/login');
      } else {
        setError(result.error ?? 'Erro ao criar conta');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Label>Tipo de Conta</Label>
        <RadioGroup
          value={accountType}
          onValueChange={(value) =>
            setAccountType(value as 'USER' | 'SUPPLIER')
          }
          className="grid grid-cols-2 gap-4"
        >
          <Label htmlFor="user" className="cursor-pointer">
            <Card
              className={`transition-all ${accountType === 'USER' ? 'border-primary ring-2 ring-primary' : ''}`}
            >
              <CardHeader className="p-4">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="USER" id="user" />
                  <User className="h-5 w-5" />
                  <div>
                    <CardTitle className="text-sm">Cliente</CardTitle>
                    <CardDescription className="text-xs">
                      Alugar equipamentos
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Label>
          <Label htmlFor="supplier" className="cursor-pointer">
            <Card
              className={`transition-all ${accountType === 'SUPPLIER' ? 'border-primary ring-2 ring-primary' : ''}`}
            >
              <CardHeader className="p-4">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="SUPPLIER" id="supplier" />
                  <Building2 className="h-5 w-5" />
                  <div>
                    <CardTitle className="text-sm">Fornecedor</CardTitle>
                    <CardDescription className="text-xs">
                      Anunciar equipamentos
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Label>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Nome Completo</Label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          placeholder="Seu nome"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="seu@email.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          placeholder="Mínimo 6 caracteres"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar Senha</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          placeholder="Repita a senha"
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isPending ? 'Criando conta...' : 'Criar Conta'}
      </Button>
    </form>
  );
};

export { RegisterForm };
