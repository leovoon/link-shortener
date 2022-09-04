import { prisma } from '../../../db/client';

export async function api(request: Request, data?: { slug: string }) {
	let result = {};
	const count = await prisma.shortLink.count({
		where: {
			slug: data?.slug
		}
	});
	result = { used: count > 0 };

	if (!data) {
		return false;
	}

	return result;
}
