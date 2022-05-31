import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }): Promise<Response> => {
	if (event.url.pathname.startsWith('/api/') || event.url.pathname === '/') {
		// intercept the request and redirect to the root
		return resolve(event);
	}

	if (event.url.pathname.startsWith('/') && event.url.pathname !== '/') {
		// link hit, redirect to the original url
		const slug = event.url.pathname.split('/').pop();
		const slugFetch = await fetch(`${event.url.origin}/api/get-url/${slug}`);
		if (slugFetch.status === 404) {
			return new Response('Not Found', { status: 404 });
		}
		const { data } = await slugFetch.json();

		if (data?.url) {
			return Response.redirect(data.url, 301);
		}
	}

	return resolve(event);
};
