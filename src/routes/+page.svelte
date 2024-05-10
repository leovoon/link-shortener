<script lang="ts">
	import CreateLink from '$lib/CreateLink.svelte';
	import LinkHistory from '$lib/LinkHistory.svelte';

	let { data } = $props();
</script>

<CreateLink data={data.serverData.form} />
{#if data.history}
	<LinkHistory history={data.history} />
{/if}
