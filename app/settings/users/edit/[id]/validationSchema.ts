import { z } from 'zod';
import { EditFormValues } from '../../types';
import { Role, UserStatus } from '@/lib/enums';

const RoleEnum = [Role.ADMIN, Role.USER] as const;
const StatusEnum = [UserStatus.ACTIVE, UserStatus.INACTIVE] as const;

export const validationSchema = z
  .object({
    id: z.string({
      error: (issue) =>
        issue.code === 'invalid_type' ? 'O ID deve ser uma string' : undefined
    }),
    name: z.string({
      error: (issue) =>
        issue.code === 'invalid_type' ? 'O nome é obrigatório' : undefined
    }),
    email: z.email('Email inválido'),
    role: z.enum(RoleEnum, {
      error: () => 'Selecione uma permissão válida'
    }),
    document: z.string().min(1, 'CPF/CNPJ é obrigatório.'),
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
      document: data.document,
      status: data.status,
      password: data.password
    };
    return result;
  });

export default validationSchema;
