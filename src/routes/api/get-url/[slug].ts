import type { RequestEvent, RequestHandlerOutput, ResponseBody } from '@sveltejs/kit';
import { prisma } from '../../../db/client';

export async function get(event: RequestEvent): Promise<RequestHandlerOutput<ResponseBody>> {
	const slug = event.params.slug;

	if (!slug || typeof slug !== 'string') {
		return {
			status: 404,
			body: {
				error: 'Bad Request',
				message: 'The request is missing a slug.'
			}
		};
	}

	const data = await prisma.shortLink.findFirst({
		where: {
			slug: {
				equals: slug
			}
		}
	});

	if (!data) {
		return {
			status: 404,
			body: {
				error: 'Not Found',
				message: 'The requested short link does not exist.'
			}
		};
	}

	return {
		headers: {
			'content-type': 'application/json',
			'access-control-allow-origin': '*',
			'cache-control': 'stale-while-revalidate, max-age=100000000'
		},
		status: 200,
		body: {
			data
		}
	};
}
