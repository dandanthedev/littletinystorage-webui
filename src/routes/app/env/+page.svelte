<script>
	import { customFetch } from '$lib/fetch.js';
	import { onMount } from 'svelte';
	let env = {};
	onMount(async () => {
		env = await customFetch('/api/env');
	});
</script>

{#each env?.env ?? [] as envItem}
	<div class="envItem">
		<h3>{envItem.key}</h3>
		<input type="text" bind:value={envItem.value} />
		<p>{envItem.comment ?? 'Unknown'}</p>
	</div>
{/each}
<button
	class="save"
	on:click={async () => {
		if (env.envType === 'env') {
			const envString = env.env.map((envItem) => `${envItem.key}=${envItem.value}`).join('\n');
			await navigator.clipboard.writeText(envString);

			alert('Copied to clipboard');
		} else {
			const res = await customFetch(
				'/api/env',
				{
					method: 'POST',
					body: JSON.stringify(env.env)
				},
				null,
				true
			).then((res) => {
				{
					if (res.status == 204) {
						alert('Saved');
					} else {
						alert('Failed to save');
					}
				}
			});
		}
	}}
>
	Save
</button>

<style>
	.envItem {
		display: block;
		margin: 0 auto;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 1rem;
		text-align: center;
		padding: 1rem;
	}

	.envItem h3 {
		font-size: 1.5rem;
		font-family: 'abeezee';
	}

	.envItem input {
		width: 80%;
		padding: 0.5rem;
		font-size: 1.2rem;
		border-radius: 0.5rem;
	}

	.envItem p {
		font-size: 1rem;
		font-family: 'abeezee';
	}

	.save {
		font-size: 2rem;
		font-family: 'abeezee';
		display: block;
		margin: 0 auto;
		padding-left: 2rem;
		padding-right: 2rem;
		padding-top: 0.7rem;
		padding-bottom: 0.7rem;
		border-radius: 0.5rem;
		margin-bottom: 1rem;
		cursor: pointer;
	}
</style>
