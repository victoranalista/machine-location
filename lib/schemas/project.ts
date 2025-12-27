import { z } from 'zod';
import { parseInputDate } from '@/lib/utils/date';

const dateTransform = z.union([z.string(), z.date()]).transform((val) => {
  if (val instanceof Date) return val;
  return parseInputDate(val);
});

export const projectCreateSchema = z
  .object({
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    description: z.string().optional(),
    clientName: z.string().min(2, 'Nome do cliente é obrigatório'),
    location: z.string().min(3, 'Localização é obrigatória'),
    totalBudget: z.coerce.number().positive('Orçamento deve ser positivo'),
    startDate: dateTransform,
    endDate: dateTransform
  })
  .transform((data) => ({
    ...data,
    totalBudget: Math.round(data.totalBudget * 100) / 100
  }));

export const projectUpdateSchema = z
  .object({
    id: z.coerce.number().int().positive(),
    name: z.string().min(3).optional(),
    description: z.string().optional(),
    clientName: z.string().min(2).optional(),
    location: z.string().min(3).optional(),
    totalBudget: z.coerce.number().positive().optional(),
    startDate: dateTransform.optional(),
    endDate: dateTransform.optional(),
    status: z
      .enum(['PLANNING', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED'])
      .optional()
  })
  .transform((data) => ({
    ...data,
    totalBudget: data.totalBudget
      ? Math.round(data.totalBudget * 100) / 100
      : undefined
  }));

export type ProjectCreateInput = z.infer<typeof projectCreateSchema>;
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;
