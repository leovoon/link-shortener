import adapter from '@sveltejs/adapter-netlify';
import preprocess from 'svelte-preprocess';

const config = {
	preprocess: preprocess(),
	kit: {
		adapter: adapter({ edge: true })
	}
};

export default config;
