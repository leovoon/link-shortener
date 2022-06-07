<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = ({ error, status }) => {
		return {
			props: {
				title: `${status}: ${error?.message}`
			}
		};
	};
</script>

<script lang="ts">
	import { goto } from '$app/navigation';
	export let title: string;
</script>

<h2>{title}</h2>

<div
	style="width: 100%; margin: 0 auto; max-width: 60vw; min-width: max-content; text-align: center;"
>
	<input on:click={() => goto('/')} type="button" value="Create New ShortLink" />
</div>
