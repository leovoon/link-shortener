import type { RequestHandler } from '@sveltejs/kit';
import { prisma } from '../../../../db/client';
import { json } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
export const GET: RequestHandler = async ({ params, setHeaders }) => {
	const slug = params.slug;

	if (!slug || typeof slug !== 'string') return error(400, 'Invalid slug');

	const data = await prisma.shortLink.findFirst({
		where: {
			slug: {
				equals: slug
			}
		}
	});

	if (!data) throw error(404, 'Not found');

	setHeaders({
		'content-type': 'application/json',
		'access-control-allow-origin': '*',
		'cache-control': 'stale-while-revalidate, max-age=100000000'
	});

	return json(data);
};
