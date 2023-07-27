import { api } from '../_api';
import { json, error, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ params, request }) => {
	const slug = params.slug;
	if (!slug) throw error(400, 'No slug provided');
	const slugUsed = await api(request, { slug });

	return json(slugUsed);
};
