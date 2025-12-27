import { Role, ActivationStatus } from '@/prisma/generated/prisma/enums';

export type RoleLabel = 'Admin' | 'Usuário';
export type StatusLabel = 'Ativo' | 'Inativo';

export interface IUser {
  id: number;
  taxpayerId: string;
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
  status: ActivationStatus;
  taxpayerId?: string;
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
  id: number;
  name: string;
  email: string;
  role: Role;
  status: ActivationStatus;
  taxpayerId?: string;
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
  id: number;
  name: string;
  email: string;
  role: Role;
  status: ActivationStatus;
  password?: string;
}

export interface IAvailabilityResponse {
  available: boolean;
  message?: string;
}

export interface BulkParams {
  userHistoryIds: number[];
}

export interface ICheckResult {
  id: number;
  version: number;
  userId: number;
  name: string;
  email: string;
  role: Role;
  status: ActivationStatus;
  password?: string;
}
