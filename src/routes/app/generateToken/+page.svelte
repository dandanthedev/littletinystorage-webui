<script>
	import { customFetch } from '$lib/fetch.js';
	import { onMount } from 'svelte';
	let result = 'Generate';

	let bucket;
	let fileName;
	let type;
	let expiresIn;

	let buckets = [];

	onMount(async () => {
		const bucketsSrv = await customFetch('/api/buckets');
		buckets = bucketsSrv ?? [];
	});
</script>

<div class="container">
	<h1>Generate Token</h1>
	<div class="form">
		<select bind:value={bucket}>
			<option disabled selected value="">Select a bucket</option>
			{#each buckets as bucket}
				<option value={bucket}>{bucket}</option>
			{/each}
		</select>
		<input type="text" placeholder="File Name (optional)" bind:value={fileName} />
		<select bind:value={type}>
			<option value="any">Any</option>
			<option value="upload">Upload</option>
			<option value="download">Download</option>
			<option value="delete">Delete</option>
			<option value="rename">Rename</option>
		</select>
		<input type="text" placeholder="Expiry (default 60s)" bind:value={expiresIn} />
		<p class="note">(examples: 10s, 1m, 1h, 1d, 1w)</p>
		<button
			on:click={async () => {
				if (!bucket) {
					result = 'Select a bucket';
					setTimeout(() => {
						result = 'Generate';
					}, 2000);
					return;
				}
				const params = new URLSearchParams();
				if (fileName) params.append('file', fileName);
				if (type !== 'any') params.append('type', type);
				if (expiresIn) params.append('expiresIn', expiresIn);
				const key = await customFetch(`/api/${bucket}/token?${params.toString()}`, {
					method: 'POST'
				});
				if (!key) return;
				//copy to clipboard
				navigator.clipboard.writeText(key);
				result = `Copied!`;
				setTimeout(() => {
					result = 'Generate';
				}, 2000);
			}}>{result}</button
		>
	</div>
</div>

<style>
	@import url(https://fonts.bunny.net/css?family=abeezee:400|fira-code:400);
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	h1 {
		font-size: 2em;
		font-family: 'abeezee';
		text-align: center;
	}

	p {
		font-size: 1em;
		font-family: 'abeezee';
		text-align: center;
		margin-top: 0;
	}

	.form {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		gap: 5px;
	}

	.form input {
		border: 1px solid #000;
		padding: 10px;
		border-radius: 5px;
		cursor: pointer;
	}
	.form button {
		border: 1px solid #000;
		padding: 10px;
		border-radius: 5px;
		cursor: pointer;
	}

	.form select {
		border: 1px solid #000;
		padding: 10px;
		border-radius: 5px;
		cursor: pointer;
	}
</style>
