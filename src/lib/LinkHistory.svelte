<script lang="ts">
	import { page } from '$app/stores';
	import type { ShortLink } from './db/schema';
	export let history: ShortLink[] = [];
</script>

{#if history.length > 0}
	<section>
		<table class="styled-table">
			<thead>
				<tr>
					<th>Slug</th>
					<th>URL</th>
					<th>Created At</th>
				</tr>
			</thead>
			<tbody>
				{#each history as item}
					<tr>
						<a href={`${$page.url.hostname}/${item.slug}`}>
							<td>{`${$page.url}${item.slug}`}</td>
						</a>
						<td>{item.url}</td>
						<td>{new Date(item.createdAt).toLocaleString()}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</section>
{/if}

<style>
	section {
		padding: 1rem;
		overflow-x: auto;
		display: flex;
		justify-content: center;
		margin-top: 1rem;
	}
	table {
		--color-tone: #00987abd;
		border-collapse: collapse;
		font-size: 0.9em;
		font-family: sans-serif;
		border: 0.5px solid rgba(128, 128, 128, 0.288);
	}

	table thead tr {
		background-color: var(--color-tone);
		color: #ffffff;
		text-align: left;
	}

	tr a {
		color: #1b68c0;
	}

	table th,
	table td {
		padding: 12px 15px;
	}

	tbody tr td {
		word-break: break-all;
		word-wrap: break-word;
	}

	table tbody tr:nth-of-type(even) {
		background-color: #d2fafdb6;
	}
</style>
