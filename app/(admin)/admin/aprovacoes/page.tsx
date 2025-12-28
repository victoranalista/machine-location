import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import { ApprovalList } from './components/ApprovalList';

const AprovacoesPage = async () => {
  const session = await auth();
  if (!session?.user) redirect('/login');
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Aprovações Pendentes</h1>
        <p className="text-muted-foreground">
          Aprove ou reprove equipamentos cadastrados por fornecedores
        </p>
      </div>
      <ApprovalList />
    </div>
  );
};

export default AprovacoesPage;
