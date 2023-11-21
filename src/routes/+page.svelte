<script lang="ts">
	import CreateLink from '$lib/CreateLink.svelte';
	import LinkHistory from '$lib/LinkHistory.svelte';

	export let data;
</script>

<CreateLink data={data.serverData.form} />
<LinkHistory history={data.history} />
