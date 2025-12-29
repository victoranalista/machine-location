import { validatedocument } from '@/lib/validators';
import { z } from 'zod';
import { UserFormValues } from '../types';
import { Role, UserStatus } from '@/lib/enums';

const RoleEnum = [Role.ADMIN, Role.USER] as const;
const StatusEnum = [UserStatus.ACTIVE, UserStatus.INACTIVE] as const;

export const validationSchema = z
  .object({
    name: z
      .string({
        error: (issue) =>
          issue.code === 'invalid_type' || issue.code === 'too_small'
            ? 'O nome é obrigatório'
            : undefined
      })
      .min(1, 'O nome é obrigatório'),
    email: z.email('Email inválido'),
    role: z.enum(RoleEnum, {
      error: () => 'Selecione uma permissão válida'
    }),
    status: z.enum(StatusEnum, {
      error: () => 'Selecione um status válido'
    }),
    document: z.string().optional(),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres')
  })
  .check((ctx) => {
    const { role, document } = ctx.value;
    if (role === Role.ADMIN || role === Role.USER) {
      if (!document) {
        ctx.issues.push({
          code: 'custom',
          message: 'document é obrigatório',
          path: ['document'],
          input: document
        });
      } else if (!/^[0-9]{11}$/.test(document)) {
        ctx.issues.push({
          code: 'custom',
          message: 'document deve conter 11 dígitos numéricos',
          path: ['document'],
          input: document
        });
      } else if (!validatedocument(document)) {
        ctx.issues.push({
          code: 'custom',
          message: 'document inválido',
          path: ['document'],
          input: document
        });
      }
    }
  })
  .transform((data) => {
    const result: UserFormValues = {
      name: data.name,
      email: data.email,
      role: data.role,
      status: data.status,
      document:
        data.role === Role.ADMIN || data.role === Role.USER
          ? (data.document ?? '')
          : '',
      password: data.password
    };
    return result;
  });

export default validationSchema;
