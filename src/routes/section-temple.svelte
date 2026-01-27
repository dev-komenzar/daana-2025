<script lang="ts">
	import Photo from "$lib/assets/ryugen-converted.png";
	import EnhancedImage from "$lib/components/ui/enhanced-image.svelte";
	import Link from "$lib/components/ui/link.svelte";
	import { inView, spring } from "motion";
	import { animate } from "motion/mini";
	import { onMount } from "svelte";

	let imageWrapper: HTMLElement;
	let descriptionElement: HTMLElement;

	onMount(() => {
		// 初期スケールを0.96に設定
		imageWrapper.style.scale = "0.96";

		// ビューポート検出開始
		const stopObserver = inView(
			imageWrapper,
			() => {
				// 進入時: 0.96 → 1 (spring)
				animate(
					imageWrapper,
					{ scale: 1 },
					{ bounce: 0.3, duration: 0.8, type: spring },
				);

				// 退出時: 1 → 0.96 (spring)
				return () => {
					animate(
						imageWrapper,
						{ scale: 0.96 },
						{ bounce: 0.2, duration: 0.6, type: spring },
					);
				};
			},
			{
				amount: 0.7, // 70%表示でトリガー
			},
		);

		// description要素のアニメーション設定
		descriptionElement.style.opacity = "0";
		descriptionElement.style.transform = "translateX(10px)";

		const stopDescriptionObserver = inView(
			descriptionElement,
			() => {
				// 進入時: 右から左へスライド + フェードイン
				animate(
					descriptionElement,
					{ opacity: 1, transform: "translateX(0)" },
					{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
				);

				// 退出時: 左から右へスライド + フェードアウト
				return () => {
					animate(
						descriptionElement,
						{ opacity: 0, transform: "translateX(10px)" },
						{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
					);
				};
			},
			{ amount: 0.5 },
		);

		// コンポーネント破棄時のクリーンアップ
		return () => {
			stopObserver();
			stopDescriptionObserver();
		};
	});

	const p = {
		bio: `
大阪外国語大学（現：大阪大学）外国語学部卒、同大大学院東南アジア・オセアニア地域言語社会研究科博士前期課程修了、修士(学術)。ミャンマー仏教の文化人類学的研究を行う中で、研究より実践に惹かれ仏教者として生きることを志す。当初日本仏教界に縁がなく、武術の指導者として世に向かおうとするも2010年に縁を得て出家・修行（真言律宗総本山西大寺）。伝統や学術を大切にしつつも、囚われない「今に活きる仏教思想」の社会実装を提唱し、実験寺院の概念と方法論を創案。日本仏教徒協会設立の礎となる。
多くの起業家、経営者、医師や学生などの精神的指導者として信頼を寄せられている。
`,
		imageUrl: Photo,
		name: "松波龍源",
		nameRomaji: "Ryugen Matsunami",
		positions: [
			"日本仏教徒協会 最高顧問 / Principal Advisor, Japan Buddhist Association",
			"実験寺院グループ 総監    / Master of the Order , Experimental Buddhism Order",
			"実験寺院 寳幢寺 僧院長 / Temple Master , Hōdō-ji Temple",
		],
	};
</script>

<section id="houdouji" class="container">
	<div class="wide-content">
		<h2 class="text-large section-header">Experimental Buddhism Order</h2>
		<h3 class="text-medium section-header-japanese houdouji">
			実験寺院グループ_執行部
		</h3>
	</div>
	<div class="wide-content body">
		<div class="card">
			<div bind:this={imageWrapper} class="image-wrapper">
				<EnhancedImage src={p.imageUrl} alt={p.name} />
			</div>

			<div class="description" bind:this={descriptionElement}>
				<h3 class="name">{p.name}</h3>
				<p class="name-romaji">{p.nameRomaji}</p>
				{#each p.positions as position (position)}
					<p class="position" >{position}</p>
				{/each}
				<p class="bio">{p.bio}</p>
				<div class="link">
					<Link href="/" textContent="VIEW MORE" />
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	#houdouji {
		margin-top: 200px;
	}

	.houdouji {
		color: #ff8957;
	}

	.body {
		margin-top: 30px;
	}

	.card {
		display: flex;
		flex-direction: row;
		column-gap: 95px;
		align-items: flex-start;
	}

	.image-wrapper {
		width: 490px;
		height: 330px;
		overflow: hidden;
		transform-origin: center center;
		will-change: transform;
	}

	.image-wrapper :global(img) {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.description {
		width: 424px;
		font-family: var(--font-body-bold);
		text-align: left;
	}

	.name {
		/* 松波龍源 */
		margin: 13px auto 0;
		font-family: var(--font-body-bold);
		font-size: 25px;
		line-height: 36px;
		color: #000;
		letter-spacing: 0.12em;
	}

	.name-romaji {
		/* Matsunami Ryugen */
		font-family: var(--font-body-bold);
		font-size: 13px;
		line-height: 16px;
		color: #000;
		letter-spacing: 0.06em;
	}

	.position {
		font-family: var(--font-body-bold);
		font-size: 10px;
		line-height: 18px;
		letter-spacing: 0.05em;
	}

	.name-romaji + .position {
		margin-top: 18px;
	}

	.bio {
		/* 1979年生まれ... */
		width: 372px;
		margin: 14px auto 0 0;
		font-family: var(--font-body-bold);
		font-size: 11px;
		line-height: 24px;
		color: #000;
		letter-spacing: 0.06em;
	}

	.link {
		margin: 35px auto 0;
	}
</style>
