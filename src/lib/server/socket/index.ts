export type Message = {
  username: string | null;
  text: string;
  value: number;
  sentAt: Date;
  valueInCurrency?: {
    currency?: string;
    value: number;
  };
};
