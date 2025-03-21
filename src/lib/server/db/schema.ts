import { relations } from 'drizzle-orm';
import { pgTable, text, timestamp, pgEnum, primaryKey, unique } from 'drizzle-orm/pg-core';
import { providers } from '../../providers';

export const providerEnum = pgEnum('provider', providers);

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  username: text('username').notNull(),
  avatarProvider: providerEnum(),
});

export const userRelations = relations(user, ({ many, one }) => ({
  externalAccounts: many(externalAccount),
  avatarProvider: one(externalAccount, {
    fields: [user.id, user.avatarProvider],
    references: [externalAccount.userId, externalAccount.provider],
  }),
}));

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }).notNull(),
});

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export type Session = typeof session.$inferSelect;
export type NewSession = typeof session.$inferInsert;

export const externalAccount = pgTable(
  'external_account',
  {
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    provider: providerEnum().notNull(),
    externalUserId: text('external_user_id').notNull(),
    externalUsername: text('external_usename').notNull(),
    socketTokenEncrypted: text('socket_token'),
    accessTokenEncrypted: text('access_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at', {
      withTimezone: true,
      mode: 'date',
    }),
    refreshTokenEncrypted: text('refresh_token'),
    avatarUrl: text('avatar_url'),
  },
  (table) => [
    primaryKey({ columns: [table.provider, table.userId] }),
    unique().on(table.provider, table.externalUserId),
  ],
);

export const externalAccountRelations = relations(externalAccount, ({ one }) => ({
  user: one(user, {
    fields: [externalAccount.userId],
    references: [user.id],
  }),
}));

export type ExternalAccount = typeof externalAccount.$inferSelect;
export type NewExternalAccount = typeof externalAccount.$inferInsert;
