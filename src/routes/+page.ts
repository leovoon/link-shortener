import { browser } from '$app/environment';
import type { z } from 'zod';
import type { selectShortLinkSchema } from '../db/schema';

export type createdShortLinkType = z.infer<typeof selectShortLinkSchema>;

export const load = () => {
	let history = [];
	if (browser) {
		history = JSON.parse(localStorage.getItem('history') || '[]');
	}
	return { history } as { history: createdShortLinkType[] };
};
