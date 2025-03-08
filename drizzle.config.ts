import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/lib/server/db/schema.ts',

  dbCredentials: {
    database: process.env.DB_DATABASE!,
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    host: process.env.DB_HOST!,
    port: process.env.DB_PORT!,
  },

  verbose: true,
  strict: true,
  dialect: 'mysql',
});
