import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';

type FornecedorLayoutProps = {
  children: React.ReactNode;
};

const FornecedorLayout = async ({ children }: FornecedorLayoutProps) => {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // Verificar se é fornecedor
  // if (session.user.role !== 'SUPPLIER') {
  //   redirect('/minha-conta');
  // }

  return <>{children}</>;
};

export default FornecedorLayout;
