<script lang="ts">
import { floatUp } from '$lib/actions'
import Logo from '$lib/assets/opening_logo.png'
import EnhancedImage from '$lib/components/ui/enhanced-image.svelte'
import ScrollIndicator from '$lib/components/ui/scroll-indicator.svelte'

let showLogo = $state(false)
let showContent = $state(false)

/**
 * ロゴ画像読み込み完了時にアニメーションを開始する。
 */
function handleLogoLoad() {
	showLogo = true
	setTimeout(() => {
		showLogo = false
		showContent = true
	}, 1200)
}
</script>

<section
	id="eyecatch"
	class="eyecatch-section"
>
	<!-- ロゴ表示エリア -->
	<div
		class="logo-area"
		class:visible={showLogo}
	>
		<EnhancedImage
			src={Logo}
			alt="Opening Logo"
			class="logo"
			loading="eager"
			fetchpriority="high"
			onload={handleLogoLoad}
		/>
	</div>

	<!-- Eyecatch コンテンツ -->
	<div
		class="hero-container eyecatch-container"
		class:visible={showContent}
	>
		<div class="eyecatch-content">
			<h1
				class="eyecatch-title"
				use:floatUp
			>
				Implement a Buddha's Praxis
			</h1>

			<p
				class="eyecatch-description"
				use:floatUp
			>
				宗教や伝統文化としてではない、純粋な「思想・哲学」としての仏教は、<br />
				最もフラットで論理破綻のない、人類のOSとしての最高到達地点ではないか？<br />
				次の時代の人類哲学は「仏教かもしれない」
			</p>
			<p
				class="eyecatch-description"
				use:floatUp
			>
				長い歴史と、文化的な経緯によって「宗教」の衣を纏い<br />
				「使いにくくなってしまった」仏教思想を、もう一度「普遍的な人類の哲学」に戻す。<br />
				現代の人類社会に、使いやすいものへと橋を渡す。<br />
				「誰もが使える仏教思想」の提供を目指します。
			</p>
		</div>
	</div>

	<ScrollIndicator targetSectionId="mission" />
</section>

<style>
.eyecatch-section {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: calc(100lvh - 180px); /* 矢印(60px) + bottom offset(120px) をカバー */
	padding: var(--space-16) 0;
	width: 100%;
	height: 100%;
}

/* ロゴ表示エリア */
.logo-area {
	position: absolute;
	inset: 0;
	display: grid;
	place-items: center;
	padding: var(--space-8);
	opacity: 0;
	transition:
		opacity 0.8s ease-out,
		transform 0.8s ease-out;
	transform: scale(0.98);
}

.logo-area.visible {
	opacity: 1;
	transform: scale(1);
}

.logo-area :global(.logo) {
	width: 100%;
	max-width: 440px;
}

/* Eyecatch コンテンツ */
.eyecatch-container {
	z-index: 1;
	padding: 0 var(--wide-content-space);
	opacity: 0;
	transition: opacity 0.5s ease-out;
}

.eyecatch-container.visible {
	opacity: 1;
}

.eyecatch-content {
	max-width: 800px;
}

.eyecatch-title {
	padding: 0 var(--space-4);
	margin: 0 0 33px;
	font-family: var(--font-body-bold);
	font-size: 25px;
	line-height: 1.4;
	color: var(--color-white);
	text-align: center;
	letter-spacing: 0.06em;
}

.eyecatch-description {
	font-family: var(--font-body);
	font-size: 14px;
	line-height: 24px;
	text-align: left;
	letter-spacing: 0.06em;
}

.eyecatch-description + .eyecatch-description {
	margin: 30px 0 0;
}

/* モバイルでは改行を非表示 */
.eyecatch-description br {
	display: none;
}

@media screen and (width >= 768px) {
	.eyecatch-section {
		min-height: calc(100lvh - 120px); /* 矢印(60px) + bottom offset(60px) をカバー */
	}

	.eyecatch-description br {
		display: inline;
	}
}
</style>
