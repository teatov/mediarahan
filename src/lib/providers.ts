export const providers = ['twitch', 'google', 'donationalerts', 'donatepay', 'github'] as const;

export type ProviderName = (typeof providers)[number];

export type ProviderInfo = {
  label: string;
  style: string;
  oauth?: boolean;
  socket?: { points?: boolean; donations?: boolean };
};

export const providerInfo: Record<ProviderName, ProviderInfo> = {
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
