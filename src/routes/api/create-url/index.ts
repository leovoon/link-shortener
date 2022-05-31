import { api } from './_api';
import type { RequestHandler } from '@sveltejs/kit';

// POST /create-url.json
export const post: RequestHandler = async ({ request }) => {
	const formData = await request.formData();
	const data = {
		slug: formData.get('slug'),
		url: formData.get('url')
	};
	const response = await api(request, data);
	return response;
};
