import { z } from 'zod';

export const lineItemCreateSchema = z
  .object({
    taskId: z.coerce.number().int().positive(),
    description: z.string().min(3, 'Descrição é obrigatória'),
    plannedCost: z.coerce
      .number()
      .min(0, 'Custo planejado não pode ser negativo'),
    realizedCost: z.coerce
      .number()
      .min(0, 'Custo realizado não pode ser negativo')
      .default(0),
    quantity: z.coerce
      .number()
      .min(0.01, 'Quantidade deve ser maior que zero')
      .default(1),
    unit: z.string().default('un')
  })
  .transform((data) => ({
    ...data,
    plannedCost: Math.round(data.plannedCost * 100) / 100,
    realizedCost: Math.round(data.realizedCost * 100) / 100,
    quantity: Math.round(data.quantity * 100) / 100
  }));

export const lineItemUpdateSchema = z.object({
  id: z.coerce.number().int().positive(),
  description: z.string().min(3).optional(),
  plannedCost: z.coerce
    .number()
    .min(0, 'Custo planejado não pode ser negativo')
    .optional(),
  realizedCost: z.coerce
    .number()
    .min(0, 'Custo realizado não pode ser negativo')
    .optional(),
  quantity: z.coerce
    .number()
    .min(0.01, 'Quantidade deve ser maior que zero')
    .optional(),
  unit: z.string().optional()
});

export type LineItemCreateInput = z.infer<typeof lineItemCreateSchema>;
export type LineItemUpdateInput = z.infer<typeof lineItemUpdateSchema>;
