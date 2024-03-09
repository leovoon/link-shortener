import { superValidate, message, setError } from 'sveltekit-superforms';
import { insertShortLinkSchema, shortlink } from '$lib/db/schema';
import { error, fail } from '@sveltejs/kit';
import { db } from '$lib/db/client';
import { eq } from 'drizzle-orm';
import { zod } from 'sveltekit-superforms/adapters';
import type { Infer } from 'sveltekit-superforms';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { building } from '$app/environment';
import { UPSTASH_REDIS_REST_TOKEN, UPSTASH_REDIS_REST_URL } from '$env/static/private';

let redis: Redis;
let ratelimit: Ratelimit;

if (!building) {
	redis = new Redis({
		url: UPSTASH_REDIS_REST_URL,
		token: UPSTASH_REDIS_REST_TOKEN
	});

	ratelimit = new Ratelimit({
		redis,
		limiter: Ratelimit.slidingWindow(5, '60 s'),
		analytics: true
	});
}

export const load = async () => {
	const form = await superValidate<Infer<typeof insertShortLinkSchema>>(zod(insertShortLinkSchema));
	return {
		form
	};
};

export const actions = {
	createLink: async (request) => {
		const form = await superValidate<Infer<typeof insertShortLinkSchema>>(
			request,
			zod(insertShortLinkSchema)
		);
		if (!form.valid) {
			return fail(400, { form });
		}
		try {
			const ip = request.getClientAddress();
			const rateLimitAttempt = await ratelimit.limit(ip);
			if (!rateLimitAttempt.success) {
				let rateLimitSentence = '';
				const timeRemaining = Math.floor((rateLimitAttempt.reset - new Date().getTime()) / 1000);
				if (timeRemaining <= 0) {
					rateLimitSentence = 'Too many requests. Please try again later.';
				} else {
					rateLimitSentence = `Too many requests. Please try again in ${timeRemaining} seconds.`;
				}

				return setError(form, 'createdAt', rateLimitSentence);
			}

			const checkSlug = await db
				.select({ slug: shortlink.slug })
				.from(shortlink)
				.where(eq(shortlink.slug, form.data.slug));

			if (checkSlug.length > 0) return setError(form, 'Name taken', { status: 409 });

			const insertedLink = await db.insert(shortlink).values({
				slug: form.data.slug,
				url: form.data.url
			}).returning();

			if (!insertedLink) return setError(form, 'Failed to create shortlink');

			form.data = insertedLink[0];
			return message(form, 'Link created.');
		} catch (e) {
			console.error(e);
			return error(500, { message: 'Server down. Please try again later.' });
		}
	}
};
