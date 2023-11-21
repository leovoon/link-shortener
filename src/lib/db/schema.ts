import { mysqlTable, serial, text, timestamp } from 'drizzle-orm/mysql-core';
import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import type { z } from 'zod';

export const shortlink = mysqlTable('ShortLink', {
	id: serial('id').primaryKey(),
	slug: text('slug').unique().notNull(),
	url: text('url').notNull(),
	createdAt: timestamp('createdAt').notNull().defaultNow()
});

export const selectShortLinkSchema = createSelectSchema(shortlink);

export const insertShortLinkSchema = createInsertSchema(shortlink, {
	url: (schema) => schema.url.min(1, 'No empty').url('Invalid URL'),
	slug: (schema) =>
		schema.slug
			.min(1, 'Must be at least 1 character long.')
			.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Must be alphanumeric with no spaces or with dashes.')
});

export type ShortLink = z.infer<typeof selectShortLinkSchema>;
export type insertedShortLink = z.infer<typeof insertShortLinkSchema>;
