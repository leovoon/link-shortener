import type { ShortLink } from '@prisma/client';
import { prisma } from '../../../db/client';

export async function api(request: Request, data?: ShortLink) {
	let result;
	if (data) {
		if (data?.slug === '' || data?.url === '') return;
		result = await prisma.shortLink.create({
			data: {
				slug: data.slug,
				url: data.url
			}
		});
	}

	return result;
}
