<script lang="ts">
import { scrollIndicator } from '$lib/actions'

let { targetSectionId = 'mission' }: { targetSectionId?: string } = $props()
let whiteLayer: SVGSVGElement = $state()!
</script>

<div
	class="scroll-indicator"
	use:scrollIndicator={{ targetSectionId, whiteLayer }}
	aria-hidden="true"
>
	<!-- 黒い矢印（下層）: 縦線 + 左上への斜め線 -->
	<svg
		class="arrow arrow-black"
		width="16"
		height="120"
		viewBox="0 0 16 120"
		fill="none"
		stroke="#000"
		stroke-width="1"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<!-- 縦線 -->
		<path d="M10 0 L10 100" />
		<!-- 左上への斜め線 -->
		<path d="M10 100 L2 84" />
	</svg>

	<!-- 白い矢印（上層、clip-pathで制御） -->
	<svg
		bind:this={whiteLayer}
		class="arrow arrow-white"
		width="16"
		height="120"
		viewBox="0 0 16 120"
		fill="none"
		stroke="#fff"
		stroke-width="1"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<!-- 縦線 -->
		<path d="M10 0 L10 100" />
		<!-- 左上への斜め線 -->
		<path d="M10 100 L2 84" />
	</svg>
</div>

<style>
.scroll-indicator {
	--scroll-indicator-bottom: -120px;

	position: absolute;
	bottom: var(--scroll-indicator-bottom);
	left: 50%;
	z-index: 10;
	translate: -50% 0;
	will-change: transform;
}

.arrow {
	display: block;
}

.arrow-black {
	position: relative;
}

.arrow-white {
	position: absolute;
	top: 0;
	left: 0;
	z-index: 1;
	clip-path: inset(100% 0 0 0); /* 初期状態: 完全に非表示 */
}

@media screen and (width >= 768px) {
	.scroll-indicator {
		--scroll-indicator-bottom: -60px;
	}
}
</style>
