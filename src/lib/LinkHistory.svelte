<script lang="ts">
	import { page } from '$app/stores';
	import type { ShortLink } from './db/schema';
	import { format } from 'timeago.js';
	import Grid from 'gridjs-svelte';
	import { h } from 'gridjs';

	import 'gridjs/dist/theme/mermaid.css';
	interface Props {
		history: ShortLink[];
	}
	let { history = [] }: Props = $props();

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
		padding: 1rem;
	}
</style>
