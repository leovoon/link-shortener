import { createSelectSchema, createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { PUBLIC_BASE_URL_DEV, PUBLIC_BASE_URL_PROD } from '$env/static/public'
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

const BASE_URL = process.env.NODE_ENV === 'development' ? PUBLIC_BASE_URL_DEV : PUBLIC_BASE_URL_PROD

export const shortlink = pgTable('pendek', {
	id: serial('id').primaryKey(),
	slug: text('slug').unique().notNull(),
	url: text('url').notNull(),
	createdAt: timestamp('createdAt').notNull().defaultNow()
});

export const selectShortLinkSchema = createSelectSchema(shortlink);

export const insertShortLinkSchema = createInsertSchema(shortlink, {
	url: (schema) =>
		schema.url.refine((v) => /^(https?):\/\//i.test(v), {
			message: 'Must be a valid URL.'
		}),
	slug: (schema) =>
		schema.slug
			.min(1, 'Must be at least 1 character long.')
			.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Must be alphanumeric with no spaces or with dashes.')
			.superRefine(async (val, ctx) => {
				if (!val) return z.NEVER;
				const res = await fetch(`${BASE_URL}/api/slug-check/${val}`, {
					method: 'POST'
				});
				const slugResult = (await res.json()) as { used: boolean };

				if (slugResult.used) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Name taken. Please try another.'
					});
				}
				return z.NEVER;
			})
});

export type ShortLink = z.infer<typeof selectShortLinkSchema>;
