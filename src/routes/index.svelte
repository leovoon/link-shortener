<script lang="ts">
	import CreateLink from '$lib/CreateLink.svelte';
	import Footer from '$lib/Footer.svelte';
</script>

<svelte:head>
	<link rel="stylesheet" href="src/global.css" />
</svelte:head>

<header>
	<h1>Pendek<sub>link-shortener</sub></h1>
</header>
<CreateLink />

<Footer />

<style>
	h1 {
		display: flex;
		flex-direction: column;
	}
	sub {
		font-size: clamp(1.4rem, 3.5vw, 2rem);
	}
</style>
