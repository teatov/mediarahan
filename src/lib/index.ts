export const providers = ['twitch', 'google', 'donationalerts', 'donatepay', 'github'] as const;

export type ProviderName = (typeof providers)[number];
