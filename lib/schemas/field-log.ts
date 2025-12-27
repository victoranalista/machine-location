import { z } from 'zod';

export const fieldLogCreateSchema = z.object({
  projectId: z.coerce.number().int().positive(),
  taskId: z.coerce
    .number()
    .int()
    .positive()
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),
  description: z
    .string()
    .min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  photoUrl: z
    .string()
    .url()
    .optional()
    .or(z.literal(''))
    .transform((val) => (val === '' ? undefined : val)),
  category: z.enum([
    'PROGRESS',
    'BLOCKER',
    'RISK',
    'MATERIAL',
    'QUALITY',
    'SAFETY'
  ])
});

export type FieldLogCreateInput = z.infer<typeof fieldLogCreateSchema>;
