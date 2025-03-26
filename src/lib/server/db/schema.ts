import { relations } from 'drizzle-orm';
import {
  pgTable,
  varchar,
  text,
  timestamp,
  pgEnum,
  primaryKey,
  unique,
  json,
} from 'drizzle-orm/pg-core';
import type { EmoteSet } from '$lib/emote';
import { providers } from '../../providers';

export const providerEnum = pgEnum('provider', providers);

export const user = pgTable('user', {
  id: varchar({ length: 255 }).primaryKey(),
  username: varchar({ length: 255 }).notNull(),
  avatarProvider: providerEnum(),
  emotes: json().$type<EmoteSet[]>().default([]),
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
  id: varchar({ length: 255 }).primaryKey(),
  userId: varchar({ length: 255 })
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  expiresAt: timestamp({ withTimezone: true, mode: 'date' }).notNull(),
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
    userId: varchar({ length: 255 })
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    provider: providerEnum().notNull(),
    externalUserId: varchar({ length: 255 }).notNull(),
    externalUsername: varchar({ length: 255 }).notNull(),
    socketTokenEncrypted: text(),
    accessTokenEncrypted: text(),
    accessTokenExpiresAt: timestamp({
      withTimezone: true,
      mode: 'date',
    }),
    refreshTokenEncrypted: text(),
    avatarUrl: text(),
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
