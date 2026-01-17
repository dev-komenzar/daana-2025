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
	<div class="message">
		<h2 class="text font-gothic-bold">全く新しい「仏教に可能性を見出す人々」を繋ぐ団体</h2>
		<p>
			日本仏教徒協会は平成29年に設立された、とても新しい団体です。<br/>
			お寺や僧侶といった「伝統の担い手側」ではなく、また「信仰や宗教」でもなく。<br/>
			仏教を「思想・哲学」として社会に生かしたい。<br/>
			西洋思想こそが文明であり正義であった時代は終わりを迎えつつあるように感じます。<br/>
			次の時代の世界のOSは「仏教かもしれない」。そう考えると我が国日本には大きなアドバンテージがあるはずです。<br/>
			仏教を真に活かし、使える思想とするために「宗教家」や「信仰者」ではない、大多数の「普通の人々」が、本物の仏教思想に触れ、学びと情報交換が出来るように。日本の「仏教徒」の意味をアップデートしたい。<br/>
			「仏教に可能性を見出す人々＝仏教徒」を繋いで世界の公益に資することができるように。我々の使命はそこにあります。
		</p>
	</div>
</section>

<style>
	.mission-section {
		position: relative;
		height: 92lvh;
		min-height: 800px;
		padding: 70px 70px 0;
		color: white;
		background-color: var(--color-primary);
		will-change: transform;
	}

	.message {
		position: absolute;
		top: 330px;
		left: 95px;
		width: min(100%, 733px);
	}

	.text {
		font-family: var(--font-gothic-bold);
		font-size: 25px;
		line-height: normal;
		letter-spacing: 0.06em;
	}
</style>
