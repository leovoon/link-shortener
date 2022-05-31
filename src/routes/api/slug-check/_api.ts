import { prisma } from '../../../db/client';

export async function api(request: Request, data?: { slug: string }) {
	let body = {};
	let status = 500;
	if (data) {
		const count = await prisma.shortLink.count({
			where: {
				slug: data?.slug
			}
		});
		body = { used: count > 0 };
	}
	status = 200;

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
