import { providers } from '$lib/providers';
import { globalErrorMap } from '$lib/zod';
import { z } from 'zod';

z.setErrorMap(globalErrorMap);

export const editProfileFormSchema = z.object({
  username: z.string().min(1).max(50),
  externalAccountAvatar: z.enum(providers).optional(),
});

export type EditProfileFormSchema = typeof editProfileFormSchema;
