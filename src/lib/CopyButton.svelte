<svelte:options runes={false} />

<script lang="ts">
	import { copy } from 'svelte-copy';

	export let copied = false;
	export let text = '';
	export let onCopy;
	export let onError;
</script>

<button use:copy={text} on:svelte-copy={onCopy} on:svelte-copy:error={onError}>
	{#if copied}
		Copied!
	{:else}
		Copy
	{/if}
</button>
