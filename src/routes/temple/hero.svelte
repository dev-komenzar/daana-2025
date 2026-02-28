<script lang="ts">
import { floatUp } from '$lib/actions'
import heroImage from '$lib/assets/temple/group_photo-c.jpg'
import EnhancedImage from '$lib/components/ui/enhanced-image.svelte'
</script>

<section class="hero">
	<EnhancedImage
		src={heroImage}
		alt="寳幢寺の僧侶たちの集合写真"
		class="hero-image"
		loading="eager"
		fetchpriority="high"
		sizes="100vw"
		objectFit="cover"
		objectPosition="var(--hero-object-position)"
	/>

	<div class="overlay">
		<h1 use:floatUp>実験寺院プロジェクト</h1>
		<p use:floatUp>歴史や文化、伝統という言葉で仏教を語らない。</p>
		<p use:floatUp>実践哲学としての仏教を「再導入」する<wbr />というプロジェクト。</p>
		<p use:floatUp>宗教や信仰ではない、<wbr />哲学としての仏教の拠点を作りたい。</p>
	</div>
</section>

<style>
.hero {
	--hero-object-position: 70% 50%;

	position: relative;
	width: 100vw;
	height: calc(100lvh + 72px);
	max-height: calc(800px + 72px);
	overflow: hidden;
}

.hero :global(.hero-image) {
	z-index: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.overlay {
	position: absolute;
	right: 0;
	bottom: 24px;
	left: 0;
	z-index: 1;
	color: #fff;
	text-align: center;
}

.overlay h1 {
	margin: 0 0 16px;
	font-family: var(--font-heading-bold);
	font-size: 32px;
	line-height: 1.4;
	letter-spacing: 0.06em;
}

.overlay p {
	margin: 0;
	font-family: var(--font-body);
	font-size: 14px;
	line-height: 24px;
	letter-spacing: 0.06em;
	word-break: keep-all;
}

@media screen and (width >= 768px) {
	.hero {
		--hero-object-position: center center;
	}

	.overlay {
		right: auto;
		bottom: 48px;
		left: 48px;
		text-align: left;
	}

	.overlay h1 {
		font-size: 32px;
	}

	.overlay p {
		font-size: 16px;
	}
}
</style>
