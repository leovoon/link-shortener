import { invalidate } from '$app/navigation';
import { db } from '../../../db/client';
import { shortlink } from '../../../db/schema';
import { error, json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

interface History {
	slug: string;
	url: string;
	createdAt: Date;
}

// POST /create-url.json
export const POST = async ({ request, cookies }) => {
	const formData = await request.formData();
	const slug = formData.get('slug') as string;
	const url = formData.get('url') as string;

	if (!slug || !url) throw error(400, 'Invalid input');
	const result = await db.insert(shortlink).values({
		slug: slug,
		url: url
	});
	if (!result) throw error(500, 'Failed to create shortlink');

	const inserted = await db
		.select()
		.from(shortlink)
		.where(eq(shortlink.id, Number(result.insertId)));

	if (inserted.length === 0) throw error(500, 'Failed to get created shortlink');

	return json(inserted[0]);
};
