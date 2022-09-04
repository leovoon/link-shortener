import { api } from '../_api';
import type { RequestHandler } from '@sveltejs/kit';

// GET /slug-check.json
export const GET: RequestHandler = async ({ params, request }) => {
	const slug = params.slug;
	let slugUsed;
	if (slug) {
		slugUsed = await api(request, { slug });
	}

	return new Response(JSON.stringify(slugUsed));
};
