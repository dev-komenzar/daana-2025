<script lang="ts">
	import type { NewsItem } from "$lib/cms";

	import { resolve } from "$app/paths";
	import { onDestroy, onMount } from "svelte";

	interface Properties {
		items: NewsItem[];
	}

	let { items }: Properties = $props();

	let currentIndex = $state(0);
	let previousIndex = $state<number>(-1);
	let intervalId: ReturnType<typeof setInterval> | undefined;

	onMount(() => {
		startAutoSlide();
	});

	onDestroy(() => {
		stopAutoSlide();
	});

	function startAutoSlide() {
		intervalId = globalThis.setInterval(() => {
			goToNext();
		}, 5000);
	}

	function stopAutoSlide() {
		if (intervalId !== undefined) {
			clearInterval(intervalId);
		}
	}

	function goToNext() {
		previousIndex = currentIndex;
		currentIndex = (currentIndex + 1) % items.length;
	}

	function goToSlide(index: number) {
		stopAutoSlide();
		previousIndex = currentIndex;
		currentIndex = index;
		startAutoSlide();
	}
</script>

<div class="carousel">
	<div class="carousel-indicators">
		{#each items as item, index (item.id)}
			<button
				class="indicator"
				class:active={currentIndex === index}
				onclick={() => goToSlide(index)}
				aria-label={`スライド${index + 1}へ移動`}
			></button>
		{/each}
	</div>

	<div class="carousel-content">
		{#each items as item, index (item.id)}
			<a
				href={resolve(`/news/${item.id}`)}
				class="carousel-slide"
				class:active={currentIndex === index}
				class:exiting={previousIndex === index}
				style:background-image={item.thumbnail?.url ? `url(${item.thumbnail.url})` : 'none'}
			>
				<div class="slide-overlay">
					<h3 class="slide-title">{item.title}</h3>
				</div>
			</a>
		{/each}
	</div>
</div>

<style>
	.carousel {
		position: relative;
		width: 100%;
		height: 400px;
		overflow: hidden;
		border-radius: 24px;
	}

	@media (width >= 768px) {
		.carousel {
			height: 370px;
		}
	}

	.carousel-indicators {
		position: absolute;
		top: 50%;
		left: 24px;
		z-index: 10;
		display: flex;
		flex-direction: column;
		gap: 12px;
		transform: translateY(-50%);
	}

	.indicator {
		width: 12px;
		height: 12px;
		padding: 0;
		cursor: pointer;
		background-color: rgb(255 255 255 / 50%);
		border: none;
		border-radius: 50%;
		transition: background-color 0.3s ease;
	}

	.indicator:hover {
		background-color: rgb(255 255 255 / 70%);
	}

	.indicator.active {
		background-color: rgb(255 255 255 / 100%);
	}

	.carousel-content {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.carousel-slide {
		position: absolute;
		top: 0;
		left: 0;
		display: block;
		visibility: hidden;
		width: 100%;
		height: 100%;
		color: inherit;
		text-decoration: none;
		pointer-events: none;
		background-position: center;
		background-size: cover;
		opacity: 0;
		transform: translateY(100%);
		transition:
			opacity 0.6s ease,
			transform 0.6s ease;
	}

	.carousel-slide.active {
		visibility: visible;
		pointer-events: auto;
		opacity: 1;
		transform: translateY(0);
	}

	.carousel-slide.exiting {
		visibility: visible;
		pointer-events: none;
		opacity: 1;
		transform: translateY(-100%);
	}

	.slide-overlay {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		padding: 32px;
		color: white;
		background: linear-gradient(to top, rgb(0 0 0 / 60%), transparent);
	}

	.slide-title {
		margin: 0 0 8px;
		font-size: 24px;
		font-weight: bold;
	}
</style>
