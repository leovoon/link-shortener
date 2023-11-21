import { superValidate, message, setError } from 'sveltekit-superforms/server';
import { insertShortLinkSchema, selectShortLinkSchema, shortlink } from '$lib/db/schema';
import { fail } from '@sveltejs/kit';
import { db } from '$lib/db/client';
import { eq } from 'drizzle-orm';

export const load = async () => {
	const form = await superValidate(selectShortLinkSchema);
	return {
		form
	};
};

export const actions = {
	createLink: async ({ request }) => {
		const form = await superValidate(request, insertShortLinkSchema);
		if (!form.valid) {
			return fail(400, { form });
		}
		try {
			const checkSlug = await db
				.select({ slug: shortlink.slug })
				.from(shortlink)
				.where(eq(shortlink.slug, form.data.slug));

			if (checkSlug.length > 0) return setError(form, 'Name taken');

			const insertLink = await db.insert(shortlink).values({
				slug: form.data.slug,
				url: form.data.url
			});

			if (!insertLink) return setError(form, 'Failed to create shortlink');

			const returning = await db
				.select()
				.from(shortlink)
				.where(eq(shortlink.id, Number(insertLink.insertId)));

			if (returning.length === 0) setError(form, 'Failed to get created shortlink');

			form.data = returning[0];
			return message(form, 'Link created.');
		} catch (e) {
			console.error(e);
			return fail(500, { form });
		}
	}
};
