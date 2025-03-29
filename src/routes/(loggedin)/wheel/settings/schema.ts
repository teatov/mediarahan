import { z } from 'zod';
import { globalErrorMap } from '$lib/zod';
import { wheelSettingsSchema } from '$lib/zod/wheel-settings';

z.setErrorMap(globalErrorMap);

export const wheelSettingsFormSchema = wheelSettingsSchema.extend({
  name: z.string().min(1).max(100),
});

export type WheelSettingsFormSchema = typeof wheelSettingsFormSchema;

export const currentWheelFormSchema = z.object({
  currentWheelId: z.string().min(1).max(225).optional(),
});

export type CurrentWheelFormSchema = typeof currentWheelFormSchema;

export const newWheelFormSchema = wheelSettingsFormSchema.pick({ name: true });

export type NewWheelFormSchema = typeof newWheelFormSchema;
