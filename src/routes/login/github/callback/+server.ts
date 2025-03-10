import * as github from '$lib/server/providers/github';
import type { OAuth2Tokens } from 'arctic';
import { error, redirect } from '@sveltejs/kit';
import type { RequestEvent } from './$types';
import type { GithubPublicUser } from '$lib/server/providers/github';
import * as table from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import db from '$lib/server/db';
import * as auth from '$lib/server/auth';
import { generateUserId } from '$lib/server/auth';

export async function GET(event: RequestEvent): Promise<Response> {
  if (event.locals.user) {
    return redirect(302, '/');
  }

  const storedState = event.cookies.get('github_oauth_state') ?? null;
  const code = event.url.searchParams.get('code');
  const state = event.url.searchParams.get('state');

  let tokens: OAuth2Tokens | null = null;

  if (code) {
    try {
      tokens = await github.oauth.validateAuthorizationCode(code);
    } catch (e) {
      console.error(e);
    }
  }

  if (!storedState || !code || !state || !tokens || storedState !== state) {
    console.error({ storedState, code, state, tokens });
    return error(400, 'Сервис, через который вы пытаетесь войти, вернул неправильные данные.');
  }

  const githubAccessToken = tokens.accessToken();

  const userRequest = new Request('https://api.github.com/user');
  userRequest.headers.set('Authorization', `Bearer ${githubAccessToken}`);
  const userResponse = await fetch(userRequest);
  const userResult: GithubPublicUser = await userResponse.json();

  const githubUserId = String(userResult.id);
  const username = userResult.login;
  const avatarUrl = userResult.avatar_url;

  const existingExternalAccount = await db.query.externalAccount.findFirst({
    where: and(
      eq(table.externalAccount.provider, 'github'),
      eq(table.externalAccount.externalUserId, githubUserId)
    ),
  });

  if (existingExternalAccount) {
    const sessionToken = auth.generateSessionToken();
    const session = await auth.createSession(sessionToken, existingExternalAccount.userId);
    auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
    return redirect(302, '/');
  }

  try {
    const userId = generateUserId();

    await db.transaction(async (tx) => {
      await db.insert(table.user).values({ id: userId, username, avatarUrl });
      await tx.insert(table.externalAccount).values({
        userId: userId,
        provider: 'github',
        externalUserId: githubUserId,
        externalUsername: username,
      });
    });

    const sessionToken = auth.generateSessionToken();
    const session = await auth.createSession(sessionToken, userId);
    auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
  } catch (e) {
    console.error(e);
    return error(500, 'При сохранении нового пользователя возникла ошибка.');
  }

  return redirect(302, '/profile');
}
