import React from 'react';
import UsersTableClient from './UsersTableClient';
import { Role, UserStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma/prisma';
import { IUser, StatusLabel, RoleLabel } from './types';

const UsersTableServer = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      document: true,
      name: true,
      email: true,
      role: true,
      status: true
    },
    orderBy: { name: 'asc' }
  });

  const roleTranslation: Record<Role, RoleLabel> = {
    ADMIN: 'Admin',
    USER: 'Usuário',
    SUPPLIER: 'Fornecedor'
  };

  const statusTranslation: Record<UserStatus, StatusLabel> = {
    ACTIVE: 'Ativo',
    INACTIVE: 'Inativo',
    SUSPENDED: 'Suspenso'
  };

  const usersData: IUser[] = users.map((user: (typeof users)[number]) => ({
    id: user.id,
    document: user.document ?? '',
    name: user.name ?? '',
    email: user.email,
    role: roleTranslation[user.role],
    status: statusTranslation[user.status]
  }));

  return <UsersTableClient usersData={usersData} />;
};

export default UsersTableServer;
