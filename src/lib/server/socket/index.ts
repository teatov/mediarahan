import type { ProviderName } from '$lib/providers';
import * as table from '$lib/server/db/schema';
import donationalerts from '$lib/server/socket/donationalerts';

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

export type SocketProvider = {
  name: ProviderName;
  createSocket(externalAccount: table.ExternalAccount): Promise<WebSocket>;
};

const socketProviders: Partial<Record<ProviderName, SocketProvider>> = { donationalerts };

export default socketProviders;
