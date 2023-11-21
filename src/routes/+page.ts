import { browser } from '$app/environment';
import type { ShortLink } from '$lib/db/schema';

export const load = async ({ data }) => {
	let history;
	if (browser) {
		history = JSON.parse(localStorage.getItem('history') || '[]') as ShortLink[];
	}
	return { serverData: data, history };
};
