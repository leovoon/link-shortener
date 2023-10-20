import { eq } from 'drizzle-orm';
import { db } from '../../../../db/client';
import { shortlink } from '../../../../db/schema';
import { json, error } from '@sveltejs/kit';

export const POST = async ({ params }) => {
	const slug = params.slug;
	if (!slug) throw error(400, 'No slug provided');
	const result = await db.select().from(shortlink).where(eq(shortlink.slug, slug));

	if (result.length === 0) return json({ used: false });
	else return json({ used: true });
};
