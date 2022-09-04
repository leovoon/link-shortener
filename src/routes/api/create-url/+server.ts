import { api } from './_api';
import { json, type RequestHandler } from '@sveltejs/kit';
import type { ShortLink } from '@prisma/client';

// POST /create-url.json
export const POST: RequestHandler = async ({ request }) => {
	const formData = await request.formData();
	const input = {
		slug: formData.get('slug'),
		url: formData.get('url')
	};
	const added = await api(request, input as ShortLink);
	return json(added);
};
