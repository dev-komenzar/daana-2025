<script lang="ts">
	import Ogp from '$lib/assets/ogp.png';
	import Favicon from '$lib/components/layout/favicon.svelte';
	import Footer from '$lib/components/layout/footer.svelte';
	import Header from '$lib/components/layout/header.svelte';
	import { SITE_FULL_URL } from '$lib/constants';
	import { MetaTags } from 'svelte-meta-tags';

	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<script src="https://webfont.fontplus.jp/accessor/script/fontplus.js?hQIULW9VvKs%3D&box=opQCTPJIssU%3D&aa=1&ab=2"></script>
</svelte:head>

<Favicon />

<MetaTags
	title='実験寺院 寳幢寺'
	description='仏教の社会実装のために新しい挑戦をするお寺・寳幢（ほうどう）寺のウェブサイトです。'
	canonical={SITE_FULL_URL}
	openGraph={{
		description: '仏教の社会実装のために新しい挑戦をするお寺・寳幢（ほうどう）寺のウェブサイトです。',
		images: [
			{
				alt: '実験寺院 寳幢寺',
				height: 600,
				url: Ogp,
				width: 800
			}
		],
		siteName: '実験寺院 寳幢寺',
		title: '実験寺院 寳幢寺',
		url: SITE_FULL_URL
	}}
/>

<div class='layout'>
	<main class='main-content'>
		<Header />
		{@render children?.()}
	</main>
	<Footer />
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