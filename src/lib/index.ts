export const providers = ['twitch', 'google', 'donationalerts', 'github'] as const;

export type Provider = (typeof providers)[number];
