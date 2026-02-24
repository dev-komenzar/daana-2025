<script lang="ts">
import { floatUp } from '$lib/actions'
import { scroll } from 'motion'
import { onMount } from 'svelte'

let missionSection: HTMLElement

// easeOutQuart: 序盤早く、最後はゆっくり
const easeOutQuart = (t: number): number => 1 - Math.pow(1 - t, 4)

onMount(() => {
	// 初期スケールを0.6に設定
	missionSection.style.scale = '0.6'

	// スクロール連動アニメーション
	const stopScroll = scroll(
		(progress: number) => {
			// progress: 0（下端に見え始め）→ 1（中央到達）
			// easeOutQuartを適用してscale: 0.6 → 1 に変換
			const easedProgress = easeOutQuart(progress)
			const scale = 0.6 + easedProgress * 0.4
			missionSection.style.scale = String(scale)
		},
		{
			offset: ['start end', 'center center'],
			target: missionSection,
		},
	)

	return () => {
		stopScroll()
	}
})
</script>

<section
	id="mission"
	class="mission-section"
	bind:this={missionSection}
>
	<div class="message">
		<h2
			class="heading font-gothic-bold"
			use:floatUp
		>
			日本へ「仏教の再導入」を。目指すのは「ひとづくり」
		</h2>
		<div class="text">
			<p use:floatUp>日本仏教徒協会は平成29年に設立された、とても新しい団体です。</p>
			<p use:floatUp>お寺や僧侶といった「伝統の担い手側」ではなく、また「信仰や宗教」でもなく。</p>
			<p use:floatUp>仏教を「思想・哲学」として社会に生かしたい。</p>
			<p use:floatUp>西洋思想こそが文明であり正義であった近現代は、物質的には大きな恩恵をもたらしましたが、心の荒廃という副作用もありました。</p>
			<p use:floatUp>それにバランスをもたらす「次の時代の世界のOS」は「仏教かもしれない」。</p>
			<p
				class="space"
				use:floatUp
			>
				古来仏教が栄えてきた我が国「日本」には、世界に対して大きなアドバンテージと役割があるはずです。
			</p>
			<p use:floatUp>「宗教・信仰」ではなく「伝統文化・慣習」でもなく「哲学としての仏教」をこの国に「再導入」したい。</p>
			<p use:floatUp>「仏教哲学に可能性を見出す人々＝仏教徒」を繋いで、未来を豊かに、幸せに生きる「ひとのあり方」に資す。</p>
			<p use:floatUp>世界の公益に貢献することができるように。我々の使命はそこにあります。</p>
		</div>
	</div>
</section>

<style>
.mission-section {
	position: relative;
	height: auto;
	color: white;
	background-color: var(--color-primary);
	background-image: url('$lib/assets/mission-bg.jpg');
	background-size: cover;
	will-change: transform;
}

.message {
	padding: 240px 16px 200px;
}

.text {
	padding-top: 72px;
}

p + p {
	margin-top: 0;
}

p.space {
	margin-top: 2em;
}

@media (width >= 768px) {
	.text p + p {
		margin-top: 0;
	}
}

@media (width >= 768px) {
	.message {
		padding: 240px 24px 200px;
	}
}

@media (width >= 1024px) {
	.mission-section {
		height: 820px;
	}

	.message {
		position: absolute;
		top: 330px;
		left: 95px;
		width: min(100%, 733px);
		padding: 0;
	}
}

.heading {
	font-family: var(--font-body-bold);
	font-size: 25px;
	line-height: normal;
	letter-spacing: 0.06em;
}
</style>
