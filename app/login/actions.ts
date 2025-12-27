'use server';
import { signOut, signIn, auth } from '@/lib/auth/auth';
import { AuthError } from 'next-auth';

export const handleSignOut = async () => {
  const session = await auth();
  if (!session) throw new Error('Not authenticated');
  await signOut();
};

export const handleSignIn = async (provider: 'google') => {
  await signIn(provider);
};

export const handleCredentialsSignIn = async (formData: FormData) => {
  const email = formData.get('email');
  const password = formData.get('password');
  if (!email || !password) {
    return { error: 'Email e senha são obrigatórios' };
  }
  try {
    await signIn('credentials', {
      email,
      password,
      redirect: true,
      redirectTo: '/dashboard'
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Credenciais inválidas' };
    }
    throw error;
  }
};
