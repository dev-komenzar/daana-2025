<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/layout/header.svelte';

	import '../app.css'

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<script src="https://webfont.fontplus.jp/accessor/script/fontplus.js?hQIULW9VvKs%3D&box=opQCTPJIssU%3D&aa=1&ab=2"></script>
</svelte:head>

<div class='layout'>
	<main class='main-content'>
		<Header />
		{@render children?.()}
	</main>
</div>

<style>
	.layout {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	.main-content {
		flex: 1;
		width: 100%;
		margin-top: 0;
	}
</style>