<script>
	import { findInstance } from '$lib/findInstance.js';
	import { onMount } from 'svelte';
	import LogoPage from '$lib/LogoPage.svelte';
	import { goto } from '$app/navigation';
	import { customFetch, setAPIKey } from '$lib/fetch.js';

	let instance;
	let key;

	onMount(async () => {
		if (localStorage.getItem('apiKey')) goto('/app');

		instance = await findInstance();
		console.log(instance);
	});
</script>

<LogoPage>
	<input type="text" placeholder="API Key" class="key" bind:value={key} />
	<button
		class="action"
		on:click={async () => {
			const isValid = await customFetch('/api/authed', {}, key);

			if (isValid === 'yes') {
				localStorage.setItem('apiKey', key);
				setAPIKey(key);
				goto('/app');
			}
		}}>Login</button
	>
</LogoPage>

<style>
	.key {
		width: 300px;
		height: 30px;
		padding: 10px;
		font-size: 1.5em;
		border-radius: 5px;
		border: 1px solid black;
		text-align: center;
	}
	.action {
		width: 300px;
		padding: 10px;
		font-size: 1em;
		margin-top: 10px;
		border-radius: 5px;
		border: 1px solid black;
		text-align: center;
		cursor: pointer;
	}
</style>
