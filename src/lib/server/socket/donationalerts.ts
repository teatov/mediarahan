import * as table from '../db/schema';
import type { Message } from '../socket';

export async function createSocket(externalAccount: table.ExternalAccount) {
  const channelId = `$alerts:donation_${externalAccount.externalUserId}`;
  let clientId: string;
  let connected: boolean = false;

  const socket = new WebSocket('wss://centrifugo.donationalerts.com/connection/websocket');

  socket.addEventListener('open', () => {
    console.log('Соединение с WebSocket установлено!');

    const connectMessage = {
      params: {
        token: externalAccount.socketToken,
      },
      id: 1,
    };
    socket.send(JSON.stringify(connectMessage));
  });

  socket.addEventListener('message', async (event) => {
    console.log('Сообщение: ', event.data);

    let data: unknown;
    try {
      data = JSON.parse(event.data);
    } catch (e) {
      console.error(e);
      return;
    }

    if (!clientId && isClientIdMessage(data)) {
      clientId = data.result.client;
      const response = await requestChannels(clientId, channelId, externalAccount);
      if (import.meta.env.DEV) {
        console.log(response);
      }

      if (!isChannelsResponse(response)) {
        console.error('Неправильный ответ с /centrifuge/subscribe');
        return;
      }

      const { channels } = response;
      const donationChannel = channels.find((channel) => channel.channel === channelId)!;

      const channelConnectMessage = {
        params: {
          channel: donationChannel.channel,
          token: donationChannel.token,
        },
        method: 1,
        id: 2,
      };
      socket.send(JSON.stringify(channelConnectMessage));
      return;
    }

    if (!connected && isChannelConnectMessage(data)) {
      connected = true;
      console.log('Подключение официально готово!');
      return;
    }

    if (!isDonationMessage(data)) {
      return;
    }

    const donation = data.result.data.data;
    const message: Message = {
      username: donation.username,
      text: donation.message,
      value: donation.amount_in_user_currency,
      sentAt: new Date(),
      valueInCurrency: {
        currency: donation.currency,
        value: donation.amount,
      },
    };
    if (import.meta.env.DEV) {
      console.log(message);
    }
  });

  socket.addEventListener('close', (event) => {
    console.log('Соединение с WebSocket закрыто:', event.code, event.reason);
  });

  socket.addEventListener('error', (error) => {
    console.error('Ошибка WebSocket:', error);
  });
}

async function requestChannels(
  clientId: string,
  channelId: string,
  externalAccount: table.ExternalAccount
) {
  const request = new Request('https://www.donationalerts.com/api/v1/centrifuge/subscribe', {
    method: 'POST',
    body: JSON.stringify({
      channels: [channelId],
      client: clientId,
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${externalAccount.accessToken}`,
    },
  });
  const response = await fetch(request);
  return await response.json();
}

type ClientIdMessage = {
  id: number;
  result: {
    client: string;
    version: string;
  };
};

function isClientIdMessage(data: unknown): data is ClientIdMessage {
  return (
    typeof data === 'object' &&
    data != null &&
    'result' in data &&
    typeof data.result === 'object' &&
    data.result != null &&
    'client' in data.result
  );
}

type ChannelsResponse = {
  channels: [
    {
      channel: string;
      token: string;
    },
  ];
};

function isChannelsResponse(data: unknown): data is ChannelsResponse {
  return (
    typeof data === 'object' &&
    data != null &&
    'channels' in data &&
    typeof data.channels === 'object' &&
    data.channels != null &&
    Array.isArray(data.channels)
  );
}

type ChannelConnectMessage = {
  result: {
    type: number;
    channel: string;
    data: {
      info: {
        user: string;
        client: string;
      };
    };
  };
};

function isChannelConnectMessage(data: unknown): data is ChannelConnectMessage {
  return (
    typeof data === 'object' &&
    data != null &&
    'result' in data &&
    typeof data.result === 'object' &&
    data.result != null &&
    'data' in data.result &&
    typeof data.result.data === 'object' &&
    data.result.data != null &&
    'info' in data.result.data &&
    typeof data.result.data.info === 'object' &&
    data.result.data.info != null &&
    'client' in data.result.data.info
  );
}

type DonationAlertsDonation = {
  id: number;
  name: 'Donations';
  username: string | null;
  message: string;
  message_type: 'text' | 'audio';
  payin_system: string | null;
  amount: number;
  currency: string;
  is_shown: 0 | 1;
  amount_in_user_currency: number;
  recipient_name: string;
  recipient: {
    user_id: number;
    code: string;
    name: string;
    avatar: string;
  };
  created_at: string;
  shown_at: string | null;
  reason: string;
};

type DonationMessage = {
  result: {
    channel: string;
    data: {
      seq: number;
      data: DonationAlertsDonation;
    };
  };
};

function isDonationMessage(data: unknown): data is DonationMessage {
  return (
    typeof data === 'object' &&
    data != null &&
    'result' in data &&
    typeof data.result === 'object' &&
    data.result != null &&
    'data' in data.result &&
    typeof data.result.data === 'object' &&
    data.result.data != null &&
    'data' in data.result.data &&
    typeof data.result.data.data === 'object' &&
    data.result.data.data != null &&
    'id' in data.result.data.data
  );
}
