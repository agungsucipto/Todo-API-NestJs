import { z, ZodType } from 'zod';

export class TodoValidation {
  static readonly CREATE: ZodType = z.object({
    title: z.string().min(1).max(100),
    description: z.string().min(1).max(100).optional(),
    status: z.string().min(1).max(100).optional()
  });

  static readonly UPDATE: ZodType = z.object({
    id: z.number().positive(),
    title: z.string().min(1).max(100),
    description: z.string().min(1).max(100).optional(),
    status: z.string().min(1).max(100).optional(),
  });

  static readonly SEARCH: ZodType = z.object({
    status: z.string().min(1).optional(),
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    page: z.number().min(1).positive(),
    size: z.number().min(1).max(100).positive(),
  });
}
