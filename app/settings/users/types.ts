import { Role, UserStatus } from '@prisma/client';

export type RoleLabel = 'Admin' | 'Usuário' | 'Fornecedor';
export type StatusLabel = 'Ativo' | 'Inativo' | 'Suspenso';

export interface IUser {
  id: string;
  document: string;
  name: string;
  email: string;
  role: RoleLabel;
  status: StatusLabel;
  password?: string;
}

export interface UserFormValues {
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  document?: string;
  password: string;
}

export interface Field {
  name: keyof UserFormValues;
  label: string;
  type: 'text' | 'email' | 'select' | 'password';
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
}

export interface UsersTableClientProps {
  usersData: IUser[];
}

export interface EditFormValues {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  document?: string;
  password?: string;
}

export interface FieldEdit {
  name: keyof EditFormValues;
  label: string;
  type: 'text' | 'email' | 'select' | 'hidden' | 'password';
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
}

export interface UpdateUserDataInput {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  password?: string;
}

export interface IAvailabilityResponse {
  available: boolean;
  message?: string;
}

export interface BulkParams {
  userHistoryIds: string[];
}

export interface ICheckResult {
  id: number;
  version: number;
  userId: number;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  password?: string;
}
