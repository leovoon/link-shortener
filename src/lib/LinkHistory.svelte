<script lang="ts">
	import { page } from '$app/stores';
	import type { ShortLink } from './db/schema';
	import { format } from 'timeago.js';
	import Grid from 'gridjs-svelte';
	import { h } from 'gridjs';

	import 'gridjs/dist/theme/mermaid.css';

	export let history: ShortLink[] = [];

	const columns = [
		{
			name: 'Slug',
			formatter: (cell: string) => h('a', { href: `${$page.url.hostname}/${cell}` }, cell)
		},
		'URL',
		{
			name: 'Created at',
			formatter: (cell: string) => format(cell)
		}
	];
</script>

{#if history.length > 0}
	<div class="container">
		<Grid data={history} {columns} />
	</div>
{/if}

<style>
	.container {
		padding: clamp(0.5rem, 5vw, 5rem);
	}
</style>
