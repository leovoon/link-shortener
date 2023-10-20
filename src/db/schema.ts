import { mysqlTable, serial, text, timestamp } from 'drizzle-orm/mysql-core';
import { createSelectSchema } from 'drizzle-zod';

export const shortlink = mysqlTable('ShortLink', {
	id: serial('id').primaryKey(),
	slug: text('slug').unique().notNull(),
	url: text('url').notNull(),
	createdAt: timestamp('createdAt').notNull().defaultNow()
});

export const selectShortLinkSchema = createSelectSchema(shortlink);
