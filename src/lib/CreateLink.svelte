<script lang="ts">
	import { page } from '$app/stores';
	import { copy } from 'svelte-copy';
	import { fly } from 'svelte/transition';
	import { flipboard } from '$lib/animation/flipboard';
	import { insertShortLinkSchema, selectShortLinkSchema, type ShortLink } from '$lib/db/schema.js';
	import { superForm } from 'sveltekit-superforms';
	import type { SuperValidated } from 'sveltekit-superforms';
	import LoadingSpinner from '$lib/LoadingSpinner.svelte';
	import { invalidate } from '$app/navigation';
	import type { Infer } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import SuperDebug from 'sveltekit-superforms';
	import CopyButton from './CopyButton.svelte';

	interface Props {
		data: SuperValidated<Infer<typeof insertShortLinkSchema>>;
	}
	let { data }: Props = $props();
	let created = $state(false);
	let copied = $state(false);

	const { form, enhance, reset, delayed, message, submitting, errors, allErrors } = superForm(
		data,
		{
			validators: zodClient(insertShortLinkSchema),
			validationMethod: 'oninput',
			resetForm: false,
			autoFocusOnError: true,

			onError: 'apply',

			onUpdated({ form }) {
				if (form.valid) {
					created = true;
					updateLocalHistory(form.data as ShortLink);
				}
			}
		}
	);

	function updateLocalHistory(created: ShortLink) {
		const localhistory = localStorage.getItem('history');
		if (localhistory) {
			const history = JSON.parse(localhistory);
			history.unshift(created);
			localStorage.setItem('history', JSON.stringify(history));
		} else {
			localStorage.setItem('history', JSON.stringify([created]));
		}
		invalidate('/');
	}
</script>

<SuperDebug data={form} display={false} />
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
				aria-invalid={$errors.url ? 'true' : undefined}
			/>
			{#if $errors.url}
				<div class="errors">
					{#if $errors.url.length > 0}
						{#each $errors.url as error}
							<span class="invalid">{error}</span>
						{/each}
					{:else}
						<span class="invalid">{$errors.url}</span>
					{/if}
				</div>
			{/if}

			<label for="slug">Name</label>
			<input
				type="text"
				name="slug"
				placeholder="enter a short name"
				autocomplete="off"
				bind:value={$form.slug}
				aria-invalid={$errors.slug ? 'true' : undefined}
			/>
			{#if $errors.slug}
				<div class="errors">
					{#if $errors.slug.length > 0}
						{#each $errors.slug as error}
							<span class="invalid">{error}</span>
						{/each}
					{:else}
						<span class="invalid">{$errors.slug}</span>
					{/if}
				</div>
			{/if}

			{#if $errors.createdAt}
				<div class="errors">
					<span class="invalid">{$errors.createdAt}</span>
				</div>
			{/if}

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
				<CopyButton 
					text={`${$page.url.origin}/${$form.slug}`} 
					onCopy={() => {
						copied = true;
						setTimeout(() => (copied = false), 2000);
					}}
				onError={(event: CustomEvent) => alert(`There was an error: ${event.detail.message})`)}
				{copied}  />
			</div>
			<div>
				<button
					onclick={() => {
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
		height: auto;
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

	.errors {
		display: flex;
		flex-direction: column;
	}
</style>
