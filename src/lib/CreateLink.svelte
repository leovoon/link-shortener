<script lang="ts">
	import { page } from '$app/stores';
	import copy from 'copy-to-clipboard';
	let success = true;
	let slug = 'mylinkforexample';
	let link = '';
	const url = $page.url.origin;
</script>

{#if success}
	<div class="flex">
		<h1>{`${url}/${slug}`}</h1>
		<input type="button" value="Copy Link" on:click={() => copy(`${url}/${slug}`)} />
	</div>
	<input
		type="button"
		value="Reset"
		onClick={() => {
			slug = '';
			link = '';
		}}
	/>
{/if}

<style>
	.flex {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
