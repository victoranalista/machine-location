import { z } from 'zod';
import { parseInputDate } from '@/lib/utils/date';

const dateTransform = z.union([z.string(), z.date()]).transform((val) => {
  if (val instanceof Date) return val;
  return parseInputDate(val);
});

export const taskCreateSchema = z.object({
  projectId: z.coerce.number().int().positive(),
  templateId: z.coerce.number().int().positive().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  startDate: dateTransform,
  endDate: dateTransform,
  parentId: z.coerce.number().int().positive().optional(),
  order: z.coerce.number().int().default(0)
});

export const taskUpdateSchema = z.object({
  id: z.coerce.number().int().positive(),
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  startDate: dateTransform.optional(),
  endDate: dateTransform.optional(),
  progress: z.coerce.number().int().min(0).max(100).optional(),
  status: z
    .enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED', 'CANCELLED'])
    .optional(),
  order: z.coerce.number().int().optional()
});

export const taskDependencySchema = z.object({
  taskId: z.coerce.number().int().positive(),
  dependsOnId: z.coerce.number().int().positive()
});

export type TaskCreateInput = z.infer<typeof taskCreateSchema>;
export type TaskUpdateInput = z.infer<typeof taskUpdateSchema>;
export type TaskDependencyInput = z.infer<typeof taskDependencySchema>;
