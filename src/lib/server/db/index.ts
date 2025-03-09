import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import { env } from '$env/dynamic/private';
import { migrate } from 'drizzle-orm/postgres-js/migrator';

const client = postgres({
  database: env.DB_DATABASE,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  host: env.DB_HOST,
  port: Number(env.DB_PORT),
});

export const db = drizzle(client, {
  schema,
});

console.log('Запускаем миграции БД...');
await migrate(db, { migrationsFolder: './drizzle' });
console.log('Миграции готовы!');
