<script>
	import LogoPage from '$lib/LogoPage.svelte';
	import { goto } from '$app/navigation';
	let instance;
</script>

<LogoPage>
	<p class="sub">We couldn't find your Little Tiny Storage instance. Please enter the URL below.</p>
	<input type="url" placeholder="https://tls.dandandev.xyz" class="key" />
	<button
		class="action"
		on:click={() => {
			localStorage.setItem('instanceURL', instance);
			goto('/');
		}}>Set</button
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
