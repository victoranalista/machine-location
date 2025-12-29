import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // Redirect based on user role
  if (session.user.role === 'ADMIN') {
    redirect('/admin');
  } else if (session.user.role === 'SUPPLIER') {
    redirect('/fornecedor');
  } else {
    redirect('/');
  }
}
