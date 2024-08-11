<script>
	import { findInstance } from '$lib/findInstance.js';
	import { customFetch } from '$lib/fetch.js';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let id = null;
	let files = [];
	let file = null;
	let fileName = '';
	let instance;

	async function getFiles() {
		const filesSrv = await customFetch(`/api/${id}/files?metadata=true`);
		files = filesSrv ?? [];
	}

	onMount(async () => {
		id = new URLSearchParams(window.location.search).get('id');
		if (!id) goto('/app');
		getFiles();
		instance = await findInstance(id);
	});

	async function download(file) {
		const download = await customFetch(
			`/${id}/${file}`,
			{
				method: 'HEAD'
			},
			null,
			true
		);
		if (download.status === 401) {
			//TODO: key required
			const params = new URLSearchParams();
			params.append('file', file);
			params.append('type', 'download');
			params.append('expiresIn', '10s');
			const key = await customFetch(`/api/${id}/token?${params.toString()}`, {
				method: 'POST'
			});
			if (!key) return;
			const downloadParams = new URLSearchParams();
			downloadParams.append('key', key);
			window.open(`${instance}/${id}/${file}?${downloadParams.toString()}`);
		} else if (download.status === 204) {
			window.open(`${instance}/${id}/${file}?${download.data}`);
		} else {
			alert('Something went wrong');
		}
	}

	async function deleteFile(file) {
		if (!confirm(`Are you sure you want to delete ${file}?`)) return;

		const tokenParams = new URLSearchParams();
		tokenParams.append('file', file);
		tokenParams.append('type', 'delete');
		tokenParams.append('expiresIn', '10s');
		const key = await customFetch(`/api/${id}/token?${tokenParams.toString()}`, {
			method: 'POST'
		});
		if (!key) return;

		const deleteParams = new URLSearchParams();
		deleteParams.append('key', key);
		await customFetch(`/${id}/${file}?${deleteParams.toString()}`, {
			method: 'DELETE'
		});

		getFiles();
	}

	async function renameFile(file, newName, newBucket) {
		if (!confirm(`Are you sure you want to rename ${file} to ${newName} in ${newBucket}?`)) return;

		const tokenParams = new URLSearchParams();
		tokenParams.append('file', file);
		tokenParams.append('type', 'rename');
		tokenParams.append('expiresIn', '10s');
		const key = await customFetch(`/api/${id}/token?${tokenParams.toString()}`, {
			method: 'POST'
		});
		if (!key) return;

		const renameParams = new URLSearchParams();
		renameParams.append('key', key);
		renameParams.append('bucket', newBucket);
		renameParams.append('name', newName);
		await customFetch(`/${id}/${file}?${renameParams.toString()}`, {
			method: 'PUT'
		});

		getFiles();
	}

	function parseSize(size) {
		if (size < 1024) return `${size} B`;
		if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
		if (size < 1024 * 1024 * 1024) return `${(size / 1024 / 1024).toFixed(2)} MB`;
		return `${(size / 1024 / 1024 / 1024).toFixed(2)} GB`;
	}
</script>

<h1 class="bucketName">{id}</h1>

<div class="upload">
	<input
		type="file"
		bind:files={file}
		on:change={(e) => {
			fileName = e.target?.files[0]?.name;
		}}
	/>
	<input type="text" bind:value={fileName} />
	<button
		on:click={async () => {
			if (!file[0]) return;
			const formData = new FormData();

			//generate token
			const tokenParams = new URLSearchParams();
			tokenParams.append('file', fileName);
			tokenParams.append('type', 'upload');
			tokenParams.append('expiresIn', '1m');
			const key = await customFetch(`/api/${id}/token?${tokenParams.toString()}`, {
				method: 'POST'
			});
			if (!key) return;
			formData.append('key', key);

			//upload file
			await customFetch(`/${id}/${fileName}?${new URLSearchParams(formData).toString()}`, {
				method: 'POST',
				body: file[0]
			});

			getFiles();
		}}>Upload</button
	>
</div>

<div class="files">
	<table>
		<thead>
			<tr>
				<th>Preview</th>
				<th>Name</th>
				<th>Size</th>
				<th>Actions</th>
			</tr>
		</thead>
		<tbody>
			{#each files as file}
				<tr>
					<td class="filePreview">
						{#if file.mimeType.startsWith('image')}
							<img src={`${instance}/${id}/${file.file}`} alt={file.file} />
						{:else if file.mimeType.startsWith('video')}
							<video src={`${instance}/${id}/${file.file}`} controls />
						{:else if file.mimeType.startsWith('audio')}
							<audio src={`${instance}/${id}/${file.file}`} controls />
						{:else}
							<p>{file.mimeType}</p>
						{/if}
					</td>
					<td>
						<button
							class="fileName"
							on:click={(e) => {
								//if holding shift, move file
								let newBucket = id;
								if (e.shiftKey) {
									const bucketPrompt = prompt(
										'Enter a new bucket (or leave blank to keep the same)'
									);
									if (bucketPrompt) newBucket = bucketPrompt;
								}
								const newName = prompt('Enter a new name', file);
								if (!newName) return;
								renameFile(file, newName, newBucket);
							}}>{file.file}</button
						>
					</td>
					<td class="fileSize">{parseSize(file.size)}</td>

					<td class="fileActions">
						<button on:click={() => download(file.file)}>Download</button>
						<button on:click={() => deleteFile(file.file)}>Delete</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<p class="tip">
	Tip: click on a file to rename it.<br />
	You can move files across buckets by holding shift and clicking on a file.
</p>

<style>
	@import url(https://fonts.bunny.net/css?family=abeezee:400);

	.bucketName {
		font-size: 2em;
		font-family: 'abeezee';
		text-align: center;
	}

	.files {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	table {
		border-collapse: collapse;
		/*gap between rows*/
		border-spacing: 0;
		width: 100%;
		max-width: 600px;
		margin-top: 20px;
	}

	th {
		font-size: 1.5em;
		font-family: 'abeezee';
	}

	.fileName {
		font-size: 1.5em;
		font-family: 'abeezee';
		background: transparent;
		border: none;
		cursor: pointer;
	}

	.fileActions {
		text-align: center;
		gap: 5px;
	}

	.fileActions button {
		border: 1px solid #000;
		padding: 10px;
		border-radius: 5px;
		cursor: pointer;
	}

	.upload {
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		gap: 5px;
	}

	.upload input {
		border: 1px solid #000;
		padding: 10px;
		border-radius: 5px;
		cursor: pointer;
	}

	.upload button {
		border: 1px solid #000;
		padding: 10px;
		border-radius: 5px;
		cursor: pointer;
	}

	.tip {
		font-size: 1em;
		font-family: 'abeezee';
		text-align: center;
		margin-top: 0;
	}

	.filePreview {
		width: 100px;
		height: 100px;
		border-radius: 5px;
		margin-right: 10px;
		margin-bottom: 10px;
	}

	.filePreview p {
		font-size: 1em;
		font-family: 'abeezee';
	}

	.filePreview img {
		width: 100%;
		height: 100%;
		border-radius: 5px;
	}

	.fileSize {
		font-size: 1em;
		font-family: 'abeezee';
		margin-left: 10px;
	}
</style>
