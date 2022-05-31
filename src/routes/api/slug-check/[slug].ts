import { api } from './_api';
import type { RequestHandler } from '@sveltejs/kit';

// GET /slug-check.json
export const get: RequestHandler = async ({ params, request }) => {
	const slug = params.slug;

	const response = await api(request, { slug });

	console.log(response);
	return response;
};
