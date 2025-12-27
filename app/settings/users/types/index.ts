import { Role } from '@/prisma/generated/prisma/client';

export interface UserFormValues {
  name: string;
  email: string;
  taxpayerId: string;
  role: Role;
}

export interface IAvailabilityResponse {
  available: boolean;
  message?: string;
}

export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}
