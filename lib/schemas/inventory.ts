import { z } from 'zod';

export const inventoryItemCreateSchema = z
  .object({
    projectId: z.coerce.number().int().positive(),
    name: z.string().min(2, 'Nome é obrigatório'),
    description: z.string().optional(),
    currentStock: z.coerce
      .number()
      .min(0, 'Estoque não pode ser negativo')
      .default(0),
    minimumStock: z.coerce
      .number()
      .min(0, 'Estoque mínimo não pode ser negativo')
      .default(0),
    unitCost: z.coerce.number().min(0, 'Custo não pode ser negativo').default(0)
  })
  .transform((data) => ({
    ...data,
    currentStock: Math.round(data.currentStock * 100) / 100,
    minimumStock: Math.round(data.minimumStock * 100) / 100,
    unitCost: Math.round(data.unitCost * 100) / 100
  }));

export const inventoryItemUpdateSchema = z.object({
  id: z.coerce.number().int().positive(),
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  unit: z.string().optional(),
  minimumStock: z.coerce
    .number()
    .min(0, 'Estoque mínimo não pode ser negativo')
    .optional(),
  unitCost: z.coerce.number().min(0, 'Custo não pode ser negativo').optional()
});

export const inventoryMovementSchema = z
  .object({
    inventoryItemId: z.coerce.number().int().positive(),
    type: z.enum(['IN', 'OUT', 'ADJUSTMENT']),
    quantity: z.coerce.number().min(0.01, 'Quantidade deve ser maior que zero'),
    reason: z.string().optional()
  })
  .transform((data) => ({
    ...data,
    quantity: Math.round(data.quantity * 100) / 100
  }));

export const globalInventoryItemCreateSchema = z
  .object({
    name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    description: z.string().optional(),
    unit: z.string().default('unidade'),
    currentStock: z.coerce
      .number()
      .min(0, 'Estoque atual não pode ser negativo'),
    minimumStock: z.coerce
      .number()
      .min(0, 'Estoque mínimo não pode ser negativo'),
    unitCost: z.coerce.number().min(0, 'Custo unitário não pode ser negativo')
  })
  .transform((data) => ({
    ...data,
    currentStock: Math.round(data.currentStock * 100) / 100,
    minimumStock: Math.round(data.minimumStock * 100) / 100,
    unitCost: Math.round(data.unitCost * 100) / 100
  }));

export type InventoryItemCreateInput = z.infer<
  typeof inventoryItemCreateSchema
>;
export type InventoryItemUpdateInput = z.infer<
  typeof inventoryItemUpdateSchema
>;
export type InventoryMovementInput = z.infer<typeof inventoryMovementSchema>;
