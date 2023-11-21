import { eq } from 'drizzle-orm';
import { db } from '../../../../lib/db/client';
import { shortlink } from '../../../../lib/db/schema';
import { json, error } from '@sveltejs/kit';

export const POST = async ({ params }) => {
	const slug = params.slug;
	if (!slug) throw error(400, 'No slug provided');
	const result = await db
		.select({ slug: shortlink.slug })
		.from(shortlink)
		.where(eq(shortlink.slug, slug));

	if (result.length === 0) return json({ used: false });
	else return json({ used: true });
};
