import { GitHub } from 'arctic';
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, ORIGIN } from '$env/static/private';

export const github = new GitHub(
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  ORIGIN + '/login/github/callback'
);
