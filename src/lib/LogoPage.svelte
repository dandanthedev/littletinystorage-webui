<div class="loginContainer">
	<img src="/logo.png" alt="Logo" class="logo" />

	<p class="title">Little Tiny Storage</p>
	<slot />
</div>

<style>
	@import url(https://fonts.bunny.net/css?family=abeezee:400);

	.loginContainer {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		background-color: lightblue;
	}

	.logo {
		width: 200px;
		height: 200px;
	}

	.title {
		font-size: 2em;
		font-weight: bold;
		font-family: 'abeezee';
	}
</style>
