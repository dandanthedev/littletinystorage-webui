<script>
	import { buckets } from '$lib/stores.js';
	import AppPage from '$lib/AppPage.svelte';
</script>

<AppPage>
	<div class="buckets">
		{#each $buckets as bucket}
			<a class="bucket" href="/app/bucket?id={bucket}">{bucket}</a>
		{/each}
	</div>
</AppPage>

<style>
	@import url(https://fonts.bunny.net/css?family=abeezee:400);

	.buckets {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 10px;
	}

	.bucket {
		width: 300px;
		padding: 10px;
		font-size: 1.5em;
		border-radius: 5px;
		border: 1px solid black;
		text-align: center;
		cursor: pointer;
		background-color: white;
		font-family: 'abeezee';
		text-decoration: none;
		color: black;
	}
</style>
