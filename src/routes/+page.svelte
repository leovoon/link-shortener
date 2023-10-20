<script>
	import CreateLink from '$lib/CreateLink.svelte';
	import LinkHistory from '$lib/LinkHistory.svelte';

	export let data;
</script>

<CreateLink />
<LinkHistory history={data.history} />
