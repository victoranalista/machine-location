import React from 'react';
import { TabsItems, TabsComponent } from '@/components/Tabs';

type TabsNames = 'users' | 'create-user' | 'task-templates' | 'inventory';

const tabsItems: TabsItems<TabsNames>[] = [
  {
    label: 'Usuários',
    href: '/settings/users',
    value: 'users'
  },
  {
    label: 'Criar Usuário',
    href: '/settings/users/create',
    value: 'create-user'
  },
  {
    label: 'Criar Tarefas',
    href: '/settings/task-templates',
    value: 'task-templates'
  },
  {
    label: 'Estoque Global',
    href: '/settings/inventory',
    value: 'inventory'
  }
];

const SettingsTabs = (props: {
  defaultValue: TabsNames;
  children: React.ReactNode;
}) => {
  const { defaultValue, children } = props;
  return (
    <TabsComponent
      defaultValue={defaultValue}
      tabsItems={tabsItems}
      children={children}
    />
  );
};

export default SettingsTabs;
