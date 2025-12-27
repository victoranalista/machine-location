import { z } from 'zod';
import { EditFormValues } from '../../types';
import { Role, ActivationStatus } from '@/lib/enums';

const RoleEnum = [Role.ADMIN, Role.USER] as const;
const StatusEnum = [
  ActivationStatus.ACTIVE,
  ActivationStatus.INACTIVE
] as const;

export const validationSchema = z
  .object({
    id: z.number({
      error: (issue) =>
        issue.code === 'invalid_type' ? 'O ID deve ser um número' : undefined
    }),
    name: z.string({
      error: (issue) =>
        issue.code === 'invalid_type' ? 'O nome é obrigatório' : undefined
    }),
    email: z.email('Email inválido'),
    role: z.enum(RoleEnum, {
      error: () => 'Selecione uma permissão válida'
    }),
    taxpayerId: z.string().min(1, 'CPF/CNPJ é obrigatório.'),
    status: z.enum(StatusEnum, {
      error: () => 'Selecione um status válido'
    }),
    password: z
      .string()
      .optional()
      .refine((val) => !val || val.length >= 6, {
        message: 'Senha deve ter pelo menos 6 caracteres'
      })
  })
  .transform((data) => {
    const result: EditFormValues = {
      id: data.id,
      name: data.name,
      email: data.email,
      role: data.role,
      taxpayerId: data.taxpayerId,
      status: data.status,
      password: data.password
    };
    return result;
  });

export default validationSchema;
