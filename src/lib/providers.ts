export const PROVIDERS = ['twitch', 'google', 'donationalerts', 'donatepay', 'github'] as const;

export type ProviderName = (typeof PROVIDERS)[number];

export type ProviderInfo = {
  label: string;
  style: string;
  oauth?: boolean;
  socket?: { points?: boolean; donations?: boolean };
};

export const PROVIDER_INFO: Record<ProviderName, ProviderInfo> = {
  twitch: { label: 'Twitch', style: 'text-twitch', oauth: true, socket: { points: true } },
  google: { label: 'Google', style: 'text-google-foreground dark:text-google', oauth: true },
  donationalerts: {
    label: 'DonationAlerts',
    style: 'text-donationalerts',
    socket: { donations: true },
  },
  donatepay: { label: 'DonatePay', style: 'text-donatepay', socket: { donations: true } },
  github: { label: 'GitHub', style: 'text-github dark:text-github-foreground', oauth: true },
};

export const SOCKET_PROVIDERS = PROVIDERS.filter(
  (providerName) => PROVIDER_INFO[providerName].socket,
);
