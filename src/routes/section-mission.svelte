<script lang="ts">
	import { scroll } from "motion";
	import { onMount } from "svelte";

	let missionSection: HTMLElement;

	// easeOutQuart: 序盤早く、最後はゆっくり
	const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4);

	onMount(() => {
		// 初期スケールを0.6に設定
		missionSection.style.scale = "0.6";

		// スクロール連動アニメーション
		const stopScroll = scroll(
			(progress: number) => {
				// progress: 0（下端に見え始め）→ 1（中央到達）
				// easeOutQuartを適用してscale: 0.6 → 1 に変換
				const easedProgress = easeOutQuart(progress);
				const scale = 0.6 + easedProgress * 0.4;
				missionSection.style.scale = String(scale);
			},
			{
				offset: ["start end", "center center"],
				target: missionSection,
			},
		);

		return () => {
			stopScroll();
		};
	});
</script>

<section id="mission" class="mission-section" bind:this={missionSection}>
	<div class="hero-container">
		<div class="mission-content">
			<h2 class="text-large font-gothic-bold">Mission</h2>
		</div>
	</div>
	<div class="message">
		<h3>コーポレートメッセージ</h3>
		<p>
			海は昼眠る、夜も眠る、ごうごう、いびきをかいて眠る。昔、昔、おお昔、海がはじめて、口開けて、笑ったときに、太陽は、目をまわして驚いた。かわいい花や、人たちを、海がのんでしまおうと、やさしく光る太陽は、魔術で、海を眠らした。海は昼眠る、夜も眠る。ごうごう、いびきをかいて眠る。
		</p>
	</div>
</section>

<style>
	.mission-section {
		display: flex;
		flex-direction: column-reverse;
		align-items: center;
		justify-content: space-between;
		min-height: 92lvh;
		padding: 70px 70px 0;
		color: white;
		background-color: var(--color-primary);
		transform-origin: center center;
		will-change: transform;
	}

	.message {
		align-self: flex-end;
		max-width: 24rem;
	}
</style>
