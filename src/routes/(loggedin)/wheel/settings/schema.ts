import { z } from 'zod';
import { globalErrorMap } from '$lib/zod';

z.setErrorMap(globalErrorMap);

export const currentWheelFormSchema = z.object({
  currentWheelId: z.string().min(1).max(225).optional(),
});

export type CurrentWheelFormSchema = typeof currentWheelFormSchema;

export const newWheelFormSchema = z.object({
  name: z.string().min(1).max(100),
});

export type NewWheelFormSchema = typeof newWheelFormSchema;
