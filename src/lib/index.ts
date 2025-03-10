export const providers = ['twitch', 'google', 'donationalerts', 'donatepay', 'github'] as const;
export const authProviders: ProviderName[] = ['twitch', 'google', 'github'];

export type ProviderName = (typeof providers)[number];
