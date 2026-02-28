<script lang="ts">
import Ogp from '$lib/assets/ogp.png'
import Analytics from '$lib/components/layout/analytics.svelte'
import Favicon from '$lib/components/layout/favicon.svelte'
import Footer from '$lib/components/layout/footer.svelte'
import Header from '$lib/components/layout/header.svelte'
import DonationButtonFloating from '$lib/components/ui/donation-button-floating.svelte'
import { SITE_FULL_URL } from '$lib/constants'
import { loadFontPlusScript } from '$lib/utils/font-loader'
import { onMount } from 'svelte'
import { MetaTags } from 'svelte-meta-tags'

import '../app.css'

let { children } = $props()

let isMenuOpen = $state(false)

const FONTPLUS_URL = 'https://webfont.fontplus.jp/accessor/script/fontplus.js?hQIULW9VvKs%3D&box=opQCTPJIssU%3D&aa=1&ab=2'

onMount(() => {
	loadFontPlusScript({
		src: FONTPLUS_URL,
		timeout: 10_000,
	})
})
</script>

<Analytics />
<Favicon />

<MetaTags
	title="日本仏教徒協会"
	description="日本へ「仏教」の再導入を目指し、世界へ「日本発の仏教」を届ける理想を掲げて。実験寺院プロジェクトに取り組む日本仏教徒協会の公式ウェブサイトです。"
	canonical={SITE_FULL_URL}
	robots="index, follow"
	additionalRobotsProps={{
		maxImagePreview: 'large',
		maxSnippet: -1,
		maxVideoPreview: -1,
		noarchive: true,
	}}
	openGraph={{
		description: '日本へ「仏教」の再導入を目指し、世界へ「日本発の仏教」を届ける理想を掲げて。実験寺院プロジェクトに取り組む日本仏教徒協会の公式ウェブサイトです。',
		images: [
			{
				alt: '日本仏教徒協会',
				height: 600,
				url: Ogp,
				width: 800,
			},
		],
		siteName: '実日本仏教徒協会',
		title: '日本仏教徒協会',
		url: SITE_FULL_URL,
	}}
/>

<!-- フォントプリローダー: フォントプラスがスキャン時にOptima Novaを検出するための隠し要素 -->
<div
	class="fontplus-preloader"
	aria-hidden="true"
>
	.
</div>

<div class="layout">
	<main class="main-content">
		<Header bind:isMenuOpen />
		{@render children?.()}
	</main>
	<Footer />
</div>

<DonationButtonFloating menuOpen={isMenuOpen} />

<style>
/* フォントプラスがOptima Novaを検出するための隠し要素 */
.fontplus-preloader {
	position: absolute;
	top: -9999px;
	left: -9999px;
	font-family: 'OptimaNovaLTPro-Regular', serif;
	font-size: 1px;
	visibility: hidden;
}

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
