import { z } from 'zod';
import { PROVIDER_INFO, PROVIDERS } from '$lib/providers';
import { globalErrorMap } from '$lib/zod';

z.setErrorMap(globalErrorMap);

export const wheelSettingsSchema = z.object({
  providers: z
    .enum(PROVIDERS)
    .array()
    .refine((arg) => arg.every((value) => PROVIDER_INFO[value].socket), {
      message: 'Допустимы только сервисы, поддерживающие получение сообщений',
    })
    .default([]),
});

export type WheelSettingsSchema = typeof wheelSettingsSchema;
export type WheelSettings = z.infer<WheelSettingsSchema>;

export const WHEEL_SETTINGS_DEFAULT = wheelSettingsSchema.parse({});
