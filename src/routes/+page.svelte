<script lang="ts">
	import CreateLink from '$lib/CreateLink.svelte';
	import LinkHistory from '$lib/LinkHistory.svelte';
	import SuperDebug from 'sveltekit-superforms';

	export let data;
</script>

<CreateLink data={data.serverData.form} />
<LinkHistory history={data.history} />
