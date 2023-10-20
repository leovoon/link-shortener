<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
</script>

<h2>{$page.status} {$page.error?.message}</h2>

<div
	style="width: 100%; margin: 0 auto; max-width: 60vw; min-width: max-content; text-align: center;"
>
	<input on:click={() => goto('/')} type="button" value="Create New ShortLink" />
</div>
