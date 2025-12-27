import { Suspense } from 'react';
import { getUserProfile } from '../actions';
import { SettingsForm } from './components/SettingsForm';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata = {
  title: 'Configurações | EquipRent',
  description: 'Configurações da sua conta'
};

const SettingsLoading = () => (
  <div className="space-y-6">
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-full" />
    <Skeleton className="h-10 w-32" />
  </div>
);

const SettingsContent = async () => {
  const profile = await getUserProfile();
  if (!profile)
    return <p className="text-muted-foreground">Perfil não encontrado</p>;
  return <SettingsForm profile={profile} />;
};

const ConfiguracoesPage = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold">Configurações</h1>
      <p className="text-muted-foreground">
        Gerencie suas informações pessoais
      </p>
    </div>
    <Suspense fallback={<SettingsLoading />}>
      <SettingsContent />
    </Suspense>
  </div>
);

export default ConfiguracoesPage;
