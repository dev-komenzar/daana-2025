<script lang="ts">
	import type { Director } from "$lib/typing.d.ts";

	import { inView, spring } from "motion";
	import { animate } from "motion/mini";
	import { onMount } from "svelte";

	let { affiliation, bio, imageUrl, name, nameRomaji, position }: Director =
		$props();

	let imageElement: HTMLImageElement;
	let descriptionElement: HTMLElement;

	onMount(() => {
		// 初期スケールを0.96に設定
		imageElement.style.scale = "0.96";

		// ビューポート検出開始
		const stopObserver = inView(
			imageElement,
			() => {
				// 進入時: 0.96 → 1 (spring)
				animate(
					imageElement,
					{ scale: 1 },
					{ bounce: 0.3, duration: 0.8, type: spring },
				);

				// 退出時: 1 → 0.96 (spring)
				return () => {
					animate(
						imageElement,
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
		descriptionElement.style.transform = "translateX(-10px)";

		const stopDescriptionObserver = inView(
			descriptionElement,
			() => {
				// 進入時: 左から右へスライド + フェードイン
				animate(
					descriptionElement,
					{ opacity: 1, transform: "translateX(0)" },
					{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
				);

				// 退出時: 右から左へスライド + フェードアウト
				return () => {
					animate(
						descriptionElement,
						{ opacity: 0, transform: "translateX(-10px)" },
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
</script>

<div class={["member-card"]}>
	<img bind:this={imageElement} src={imageUrl} alt={name} class="image" />

	<div class="description" bind:this={descriptionElement}>
		<p class="position">{position}</p>
		<h3 class="name">{name}</h3>
		<p class="name-romaji">{nameRomaji}</p>
		<p class="affiliation">{affiliation}</p>
		<p class="bio">{bio}</p>
	</div>
</div>

<style>
	.member-card {
		padding: 0;
		margin: 95px auto 0;
	}

	.image {
		width: 512px;
		height: 312px;
		aspect-ratio: 512 / 312;
		object-fit: cover;
		transform-origin: center center;
		will-change: transform;
	}

	.description {
		font-family: var(--font-gothic-bold);
		text-align: left;
	}

	.position {
		/* 代表理事 */
		margin: 0;
		font-family: var(--font-gothic-bold);
		font-size: 13px;
		line-height: 19px;
		color: #000;
		letter-spacing: 0.06em;
	}

	.name {
		/* 藏本龍介 */
		margin: 13px auto 0;
		font-family: var(--font-gothic-bold);
		font-size: 25px;
		line-height: 48px;
		color: #000;
		letter-spacing: 0.12em;
	}

	.name-romaji {
		/* Kuramoto Ryosuke */
		font-family: var(--font-gothic-bold);
		font-size: 13px;
		line-height: 24px;
		color: #000;
		letter-spacing: 0.06em;
	}

	.affiliation {
		/* 東京大学東洋文化研究所・准教授 */
		margin: 6px auto 0;
		font-family: var(--font-gothic-bold);
		font-size: 13px;
		line-height: 24px;
		color: #000;
		letter-spacing: 0.06em;
	}

	.bio {
		/* 1979年生まれ... */
		margin: 14px auto 0;
		font-family: var(--font-gothic-bold);
		font-size: 11px;
		line-height: 24px;
		color: #000;
		letter-spacing: 0.06em;
	}

	@media (width >= 768px) {
		.member-card {
			display: flex;
			flex-direction: row-reverse;
			column-gap: 60px;
			align-items: flex-start;
		}

		/* image, descriptionはmember-cardの子要素 */
		.image {
			flex-basis: 512px;
		}

		.description {
			flex-basis: 390px;
		}
	}
</style>
