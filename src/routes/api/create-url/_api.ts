import type { ShortLink } from '@prisma/client';
import { prisma } from '../../../db/client';

export async function api(request: Request, data?: ShortLink) {
	let body = {};
	let status = 500;
	if (request.method.toUpperCase() === 'POST') {
		if (data) {
			if (data?.slug === '' || data?.url === '') return;
			body = await prisma.shortLink.create({
				data: {
					slug: data.slug,
					url: data.url
				}
			});
		}

		status = 201;
	}

	// if the request came from a <form> submission, the browser's default
	// behaviour is to show the URL corresponding to the form's "action"
	// attribute. in those cases, we want to redirect them back to the
	// /todos page, rather than showing the response
	if (request.method !== 'GET' && request.headers.get('Accept') !== 'application/json') {
		return {
			status: 303,
			headers: {
				location: '/'
			}
		};
	}

	return {
		status,
		body
	};
}
