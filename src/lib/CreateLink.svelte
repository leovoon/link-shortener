<script lang="ts">
	import { page } from '$app/stores';
	import { copy } from 'svelte-copy';
	import { fly } from 'svelte/transition';
	import { flipboard } from '$lib/animation/flipboard';
	import type { selectShortLinkSchema, ShortLink } from '$lib/db/schema.js';
	import { superForm } from 'sveltekit-superforms/client';
	import type { SuperValidated } from 'sveltekit-superforms';
	import LoadingSpinner from '$lib/LoadingSpinner.svelte';
	import { invalidate } from '$app/navigation';

	export let data: SuperValidated<typeof selectShortLinkSchema>;
	let created = false;
	let copied = false;

	const { form, enhance, constraints, reset, delayed, message, submitting, errors, allErrors } =
		superForm(data, {
			validators: {
				slug: async (slug) => {
					if (!slug) return;
					try {
						const res = await fetch(`/api/slug-check/${slug}`, {
							method: 'POST'
						});
						const slugResult = (await res.json()) as { used: boolean };

						if (slugResult.used) {
							return 'Slug already in use';
						}
						return null;
					} catch (error) {
						console.error(error);
						return 'Something went wrong';
					}
				}
			},
			validationMethod: 'oninput',
			onUpdated({ form }) {
				if (form.valid) {
					created = true;
					updateLocalHistory(form.data);
				}
			}
		});

	function updateLocalHistory(created: ShortLink) {
		const localhistory = localStorage.getItem('history');
		if (localhistory) {
			const history = JSON.parse(localhistory);
			history.unshift(created);
			localStorage.setItem('history', JSON.stringify(history));
		} else {
			localStorage.setItem('history', JSON.stringify([created]));
		}
		invalidate((url) => url.pathname === '/');
	}
</script>

<section>
	{#if !created}
		<form method="POST" action="?/createLink" use:enhance in:fly={{ x: 100, delay: 400 }}>
			{#if $message}
				<p>{$message}</p>
			{/if}
			<label for="url">Url</label>
			<input
				type="url"
				name="url"
				placeholder="enter url here"
				bind:value={$form.url}
				autocomplete="off"
				{...$constraints.url}
				aria-invalid={$errors.url ? 'true' : undefined}
			/>
			{#if $errors.url}<span class="invalid">{$errors.url}</span>{/if}

			<label for="slug">Name</label>
			<input
				type="text"
				name="slug"
				placeholder="enter a short name"
				autocomplete="off"
				bind:value={$form.slug}
				{...$constraints.url}
				aria-invalid={$errors.slug ? 'true' : undefined}
			/>
			{#if $errors.slug}<span class="invalid">{$errors.slug}</span>{/if}
			<button type="submit" disabled={$submitting}>
				{#if $delayed}
					<LoadingSpinner />
				{:else}
					Create short link
				{/if}
			</button>
		</form>
	{:else}
		<div class="container" in:fly={{ x: -100, delay: 400 }} out:fly={{ x: -100 }}>
			<p>Grab your link 👇👇👇</p>
			<div class="link-section">
				<h3 transition:flipboard|local={{ delay: 300, duration: 400 }} style="margin-block: 0px;">
					{$page.url.origin}/{$form.slug}
				</h3>
				<button
					use:copy={`${$page.url.origin}/${$form.slug}`}
					on:svelte-copy={() => {
						copied = true;
						setTimeout(() => (copied = false), 2000);
					}}
					on:svelte-copy:error={(event) => alert(`There was an error: ${event.detail.message})`)}
				>
					{#if copied}
						Copied!
					{:else}
						Copy
					{/if}
				</button>
			</div>
			<div>
				<button
					on:click={() => {
						reset();
						created = false;
					}}
				>
					Create a new one
				</button>
			</div>
		</div>
	{/if}
</section>

<style>
	section {
		position: relative;
		max-width: 640px;
		width: 90vw;
		height: 360px;
		max-height: 65vh;
		display: grid;
		margin: 0 auto;
		place-items: center;
		overflow-x: none;
	}

	.link-section {
		margin-block: 2rem;
		display: grid;
		gap: 1rem;
	}

	form {
		position: absolute;
	}
	.container {
		position: absolute;
		width: inherit;
		display: grid;
		place-content: center;
	}

	span.invalid {
		color: #f04b4b;
		padding-left: 20px;
	}
	p {
		text-align: center;
	}
</style>
