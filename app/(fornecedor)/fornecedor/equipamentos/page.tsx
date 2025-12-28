import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import { EquipmentList } from './components/EquipmentList';

const EquipmentosPage = async () => {
  const session = await auth();
  if (!session?.user) redirect('/login');
  return <EquipmentList />;
};

export default EquipmentosPage;
