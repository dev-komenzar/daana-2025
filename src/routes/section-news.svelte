<script lang="ts">
	import NewsCarousel from "$lib/components/ui/news-carousel.svelte";
	import { getNewsRemote } from "$lib/news.remote";

	const query = getNewsRemote({
		fields: ["id", "title", "publishedAt", "thumbnail"],
		limit: 3,
		offset: 0,
	});
</script>

<section id="news" class="container">
	<div class="wide-content">
		<div class="news-header">
			<h2 class="text-large font-gothic-bold">NEWS</h2>
			<p>Check it UP!</p>
		</div>
		<div class="carousel">
			{#if query.error}
				<p>記事が見つかりませんでした。</p>
			{:else if query.loading}
				<p>Loading...</p>
			{:else}
				{#if !query.current}
					<p>記事が見つかりませんでした。</p>
				{:else}
				<NewsCarousel items={query.current} />
				{/if}
			{/if}
		</div>
	</div>
</section>

<style>
	.wide-content {
		display: flex;
		flex-direction: column;
		gap: 40px;
	}

	.news-header {
		display: flex;
		flex-shrink: 0;
		flex-direction: column;
		align-items: center;
	}

	.carousel {
		width: 100%;
	}

	@media (width >= 768px) {
		.wide-content {
			flex-direction: row;
			align-items: center;
		}

		.news-header {
			flex: 1;
		}

		.carousel {
			flex-shrink: 0;
			width: 500px;
		}
	}
</style>
