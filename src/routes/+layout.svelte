<script lang="ts">
	import Footer from '$lib/Footer.svelte';
	let {children} = $props()
</script>

<svelte:head>
	<link rel="stylesheet" href="global.css" />
</svelte:head>

<header>
	<h1>Pendek<sub>link-shortener</sub></h1>
</header>
<main>
{@render children()}
</main>
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
