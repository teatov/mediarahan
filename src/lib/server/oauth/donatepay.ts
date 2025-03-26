import type { ProviderUserInfo } from '.';

export const getUserInfo = async (accessToken: string): Promise<ProviderUserInfo> => {
  const userUrl = new URL('https://donatepay.ru/api/v1/user');
  userUrl.searchParams.set('access_token', accessToken);
  const userResponse = await fetch(userUrl);
  const { data } = (await userResponse.json()) as {
    data: {
      id: number;
      name: string;
      avatar: string;
    };
  };

  if (import.meta.env.DEV) {
    console.log(data);
  }

  const socketTokenResponse = await fetch('https://donatepay.ru/api/v2/socket/token', {
    method: 'POST',
    body: JSON.stringify({ access_token: accessToken }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const socketTokenData = (await socketTokenResponse.json()) as { token: string };

  if (import.meta.env.DEV) {
    console.log(socketTokenData);
  }

  return {
    externalUserId: String(data.id),
    username: data.name,
    avatarUrl: data.avatar,
    socketToken: socketTokenData.token,
    accessToken: accessToken,
    accessTokenExpiresAt: null,
    refreshToken: null,
  };
};
