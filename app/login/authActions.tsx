'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { handleSignIn, handleCredentialsSignIn } from './actions';
import { Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { useState } from 'react';

export default function AuthActions() {
  const [error, setError] = useState('');
  const handleCredentialsSubmit = async (formData: FormData) => {
    setError('');
    const result = await handleCredentialsSignIn(formData);
    if (result?.error) setError(result.error);
  };
  return (
    <div className="space-y-4 w-full">
      <form action={handleCredentialsSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <Input id="password" name="password" type="password" required />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <CredentialsButton />
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Ou</span>
        </div>
      </div>
      <form action={() => handleSignIn('google')}>
        <GoogleButton />
      </form>
    </div>
  );
}

const CredentialsButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" disabled={pending}>
      {pending && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
      )}
      {pending ? 'Entrando...' : 'Entrar'}
    </Button>
  );
};

const GoogleButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" variant="outline" disabled={pending}>
      {pending && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
      )}
      {pending ? 'Entrando...' : 'Login com o Google'}
    </Button>
  );
};
