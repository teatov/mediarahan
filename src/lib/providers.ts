export const providers = ['twitch', 'google', 'donationalerts', 'donatepay', 'github'] as const;
export const authProviders: ProviderName[] = ['twitch', 'google', 'github'];
export const socketProviders: ProviderName[] = ['donationalerts', 'donatepay', 'twitch'];
export const pointSocketProviders: ProviderName[] = ['twitch'];
export const donationSocketProviders: ProviderName[] = ['donationalerts', 'donatepay'];

export type ProviderName = (typeof providers)[number];

export const providerLabels: Record<ProviderName, string> = {
  twitch: 'Twitch',
  google: 'Google',
  donationalerts: 'DonationAlerts',
  donatepay: 'DonatePay',
  github: 'GitHub',
};

export const providerStyles: Record<ProviderName, string> = {
  twitch: 'text-twitch',
  google: 'text-google-foreground dark:text-google',
  donationalerts: 'text-donationalerts',
  donatepay: 'text-donatepay',
  github: 'text-github dark:text-github-foreground',
};
