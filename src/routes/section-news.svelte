<script lang="ts">
	import NewsCarousel from "$lib/components/ui/news-carousel.svelte";
	import NewsLink from '$lib/components/ui/news-link.svelte';
	import { getNewsRemote } from "$lib/news.remote";

	const query = getNewsRemote({
		fields: ["id", "title", "publishedAt", "thumbnail", "content"],
		limit: 3,
		offset: 0,
	});

	let currentIndex = $state(0);
	let previousIndex = $state(-1);
	let lastKnownIndex = -1;

	$effect(() => {
		// currentIndex が変わった時、前の値を previousIndex に保存
		if (lastKnownIndex !== -1 && lastKnownIndex !== currentIndex) {
			previousIndex = lastKnownIndex;
		}
		lastKnownIndex = currentIndex;
	});

	function formatDate(isoDate: string): string {
		const date = new Date(isoDate);
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		return `${year}.${month}.${day}`;
	}

	function stripHtml(html: string): string {
		return html.replaceAll(/<[^>]*>/g, "");
	}

	function truncate(text: string, maxLength: number): string {
		if (text.length <= maxLength) return text;
		return text.slice(0, maxLength) + "...";
	}

</script>

<section id="news" class="container">
	<div class="wide-content news">
		<div class="news-header">
			<h2 class="text-large font-gothic-bold">NEWS</h2>
			<p class="sub-heading">Check it UP!</p>

			{#if query.error}
				<p class="no-news-message">ニュースが取得できません</p>
			{:else if query.loading}
				<p>Loading...</p>
			{:else if !query.current || query.current.length === 0}
				<p class="no-news-message">ニュースが取得できません</p>
			{:else}
				<div class="article-info-container">
					{#each query.current as item, index (item.id)}
						<div
							class="article-info"
							class:active={currentIndex === index}
							class:exiting={previousIndex === index}
						>
							<p class="date">{item.publishedAt ? formatDate(item.publishedAt) : ""}</p>
							<h3 class="article-title">{item.title ?? ""}</h3>
							<p class="article-description">
								{item.content ? truncate(stripHtml(item.content), 100) : ""}
							</p>
						</div>
					{/each}
				</div>
				<NewsLink href={`/news/${query.current[currentIndex].id}`} textContent='VIEW NOTE' />
			{/if}
			
		</div>
		<div class="carousel">
			{#if query.error}
				<p class="no-news-message">ニュースが取得できません</p>
			{:else if query.loading}
				<p>Loading...</p>
			{:else if !query.current || query.current.length === 0}
				<p class="no-news-message">ニュースが取得できません</p>
			{:else}
				<NewsCarousel items={query.current} bind:currentIndex />
			{/if}
		</div>
	</div>
</section>

<style>
	.news {
		display: flex;
		flex-direction: column;
		gap: 40px;
	}

	.news-header {
		display: flex;
		flex-direction: column;
		align-items: start;
	}

	.sub-heading {
		/* Check it UP! */
		font-family: "Noto Sans JP Regular", sans-serif;
		font-size: 20px;
		line-height: 29px;
		color: #3C87C0;
	}

	.article-info-container {
		position: relative;
		height: 200px;
		margin-top: 31px;
	}

	.article-info {
		position: absolute;
		top: 0;
		left: 0;
		opacity: 0;
		transition: opacity 0.4s ease;
	}

	.article-info.active {
		opacity: 1;
	}

	.article-info.exiting {
		opacity: 0;
	}

	.date {
		/* 2025.01.01 */
	font-family: var(--font-heading-bold);
	font-size: 11px;
	line-height: 16px;
	color: #3C87C0;
	letter-spacing: 0.02em;
	}

	.article-title {
		display: -webkit-box;
		overflow: hidden;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		font-family: var(--font-body-bold);
		font-size: 19px;
		line-height: 28px;
		letter-spacing: 0.08em;
		-webkit-box-orient: vertical;
	}

	.article-description {
		display: -webkit-box;
		width: 360px;
		overflow: hidden;
		-webkit-line-clamp: 4;
		line-clamp: 4;
		font-family: var(--font-body);
		font-size: 12px;
		line-height: 19px;
		letter-spacing: 0.08em;
		-webkit-box-orient: vertical;
	}

	.carousel {
		width: 100%;
	}

	/* 他セクションは1024pxだが、カルーセル(500px)とニュースリストの両方を
	   横並びで収めるため、このセクションのみ1100pxに設定 */
	@media (width >= 1100px) {
		.wide-content {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
		}

		.news-header {
			flex: 1;
			min-width: 0;
		}

		.carousel {
			flex-shrink: 0;
			width: 500px;
		}

		.article-description {
			width: 360px;
		}
	}
</style>
