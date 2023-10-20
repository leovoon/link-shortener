import { mysqlTable, serial, text, timestamp } from 'drizzle-orm/mysql-core';

export const shortlink = mysqlTable('ShortLink', {
	id: serial('id').primaryKey(),
	slug: text('slug').unique().notNull(),
	url: text('url').notNull(),
	createdAt: timestamp('createdAt').notNull().defaultNow()
});
