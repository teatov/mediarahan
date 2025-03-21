import { z } from 'zod';
import { providers } from '$lib/providers';
import { globalErrorMap } from '$lib/zod';

z.setErrorMap(globalErrorMap);

export const editProfileFormSchema = z.object({
  username: z.string().min(1).max(50),
  avatarProvider: z.enum(providers).optional(),
});

export type EditProfileFormSchema = typeof editProfileFormSchema;
