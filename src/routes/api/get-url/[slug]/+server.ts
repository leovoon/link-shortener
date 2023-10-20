import { db } from '../../../../db/client';
import { shortlink } from '../../../../db/schema';
import { json } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export const prerender = 'auto';

export const GET = async ({ params, setHeaders }) => {
	const slug = params.slug;

	if (!slug || typeof slug !== 'string') throw error(400, 'Invalid slug');

	const data = await db.query.shortlink.findFirst({
		where: eq(shortlink.slug, slug)
	});

	if (!data) throw error(404, 'Not found');

	setHeaders({
		'content-type': 'application/json',
		'access-control-allow-origin': '*',
		'cache-control': 'stale-while-revalidate, max-age=100000000'
	});

	return json(data);
};
