<script lang="ts">
	import { page } from '$app/stores';
	import copy from 'copy-to-clipboard';
	import { enhance } from '$lib/action/form';
	import debounce from 'lodash.debounce';
	import { fly } from 'svelte/transition';
	import { flipboard } from '$lib/animation/flipboard';
	import { z } from 'zod';

	let successCreated = false;
	let slug = '';
	let link = '';
	let status = '';
	let slugUsed = false;
	const alphanumericString = z.string().regex(/^[a-zA-Z0-9]*$/);
	$: invalidChar = slug.length > 0 && !alphanumericString.safeParse(slug).success;
	$: urlString = z.string().url().safeParse(link);
	$: urlInvalid = link.length > 0 && !urlString.success;
	const url = $page.url.origin;

	const handleInput = debounce(() => {
		slugValidate();
	}, 500);

	async function slugValidate() {
		slug = slug.trim();
		if (slug === '') {
			status = '';
			return;
		}

		if (!invalidChar) {
			const res = await fetch(`${url}/api/slug-check/${slug}`, {
				method: 'POST'
			});
			try {
				const { used } = await res.json();
				slugUsed = used;
				if (slugUsed) {
					status = 'slug already in use';
				} else if (slugUsed === false) {
					status = 'slug name ok';
				} else {
					throw new Error('Something went wrong');
				}
			} catch (error) {
				if (error instanceof Error) {
					status = error.message;
				}
			}
		}
	}

	function handleCopy() {
		copy(`${url}/${slug}`);
		status = 'Copied!';
	}
</script>

{#key status}
	<h2 in:fly={{ y: -20 }}>{status}</h2>
{/key}
<section>
	{#if successCreated}
		<div in:fly={{ x: 100, delay: 400 }} out:fly class="container">
			<h3 transition:flipboard|local={{ delay: 300, duration: 800 }}>{`${url}/${slug}`}</h3>
			<div style:max-width="640px" style:min-width="60vw" style:margin="0 auto">
				<input type="button" value="Copy Link" on:click={handleCopy} />
				<input
					type="button"
					value="Reset"
					on:click={() => {
						slug = '';
						link = '';
						status = '';
						successCreated = false;
					}}
				/>
			</div>
		</div>
	{:else}
		<form
			in:fly={{ x: -100, delay: 400 }}
			out:fly={{ x: -100 }}
			use:enhance={{
				pending: () => {
					status = 'Generating...';
				},
				result: async (res, form) => {
					const created = await res.json();
					if (created.slug === slug) {
						successCreated = true;
						status = 'Done ✔️';
					}
					form.reset();
				}
			}}
			action="/api/create-url"
			method="post"
		>
			<label for="slug">Your link</label>
			<input
				required
				class:error-class={urlInvalid}
				type="url"
				name="url"
				bind:value={link}
				placeholder="https://long-long-secret.com"
			/>
			{#if urlInvalid}<sub>Please enter a valid link</sub>{/if}

			<label for="slug">Give a slug name</label>

			<input
				class:error-class={slugUsed || invalidChar}
				required
				type="text"
				name="slug"
				on:input={handleInput}
				bind:value={slug}
				placeholder="yourfancyname"
			/>
			{#if slugUsed && slug !== ''}<sub>Slug name used.</sub>{/if}
			{#if invalidChar}<sub>No spaces or special characters except dashes between word. </sub>{/if}

			<input
				disabled={slugUsed || invalidChar || urlInvalid}
				type="submit"
				value="Create Short Link"
			/>
		</form>
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
	form {
		position: absolute;
	}
	.container {
		position: absolute;
		width: inherit;
		display: grid;
		place-items: center;
	}

	sub {
		color: #f04b4b;
		padding-left: 20px;
	}
</style>
