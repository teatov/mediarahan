export const providers = ['twitch', 'google', 'donationalerts', 'donatepay', 'github'] as const;

export type Provider = (typeof providers)[number];
