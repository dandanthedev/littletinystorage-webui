<script>
	import { goto } from '$app/navigation';
	import { customFetch } from '$lib/fetch.js';
	import { buckets } from '$lib/stores.js';
	import { onMount } from 'svelte';

	onMount(async () => {
		const isAuthed = await customFetch('/api/authed', {});
		if (isAuthed === 'yes') {
			let DBBuckets = await customFetch('/api/buckets', {});
			buckets.set(DBBuckets);
		} else {
			localStorage.removeItem('apiKey');
			goto('/');
		}
	});
</script>

<div class="appContainer">
	<div class="header">
		<img src="/logo.png" alt="Logo" class="logo" />
		<div class="menu">
			<a href="/app">Home</a>
			<a href="/app/generateToken">Generate Token</a>
		</div>
		<button
			class="action"
			on:click={() => {
				localStorage.removeItem('apiKey');
				goto('/');
			}}>Logout</button
		>
	</div>
	<br />
	<slot />
</div>

<style>
	@import url(https://fonts.bunny.net/css?family=abeezee:400);

	.appContainer {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;

		background-color: lightblue;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px;
		background-color: white;
		max-height: 50px;
	}
	.logo {
		width: 70px;
	}

	.action {
		font-size: 1.5em;
		border-radius: 5px;
		border: 1px solid black;
		text-align: center;
		cursor: pointer;
		padding: 5px;
	}

	.menu {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 10px;
	}

	.menu a {
		font-size: 1.5em;
		text-decoration: none;
		font-family: 'abeezee';
		color: black;
	}
</style>
