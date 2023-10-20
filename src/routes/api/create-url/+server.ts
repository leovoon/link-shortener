import { db } from '../../../db/client';
import { shortlink } from '../../../db/schema';
import { error, json } from '@sveltejs/kit';

// POST /create-url.json
export const POST = async ({ request }) => {
	const formData = await request.formData();
	const slug = formData.get('slug') as string;
	const url = formData.get('url') as string;

	if (!slug || !url) throw error(400, 'Invalid input');
	const result = await db.insert(shortlink).values({
		slug: slug,
		url: url
	});
	return json(result);
};
