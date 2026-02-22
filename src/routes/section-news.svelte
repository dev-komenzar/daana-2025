<script lang="ts">
import { resolve } from '$app/paths'
import NewsCarousel from '$lib/components/ui/news-carousel.svelte'
import NewsLink from '$lib/components/ui/news-link.svelte'
import { getNewsSectionPrerender } from '$lib/news/news.remote'
import { stripHtml, truncate } from '$lib/utils/description'

import PinnedNews from './pinned-news.svelte'

const newsPromise = getNewsSectionPrerender()

let currentIndex = $state(0)
let previousIndex = $state(-1)
let lastKnownIndex = -1

$effect(() => {
	// currentIndex が変わった時、前の値を previousIndex に保存
	if (lastKnownIndex !== -1 && lastKnownIndex !== currentIndex) {
		previousIndex = lastKnownIndex
	}
	lastKnownIndex = currentIndex
})

function formatDate(isoDate: string): string {
	const date = new Date(isoDate)
	const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')
	return `${year}.${month}.${day}`
}
</script>

<section
	id="news"
	class="container"
>
	<div class="wide-content news">
		<div class="news-header">
			<h2 class="text-large font-gothic-bold">PICK UP</h2>
			<p class="sub-heading">Check it UP!</p>

			{#await newsPromise}
				<p>Loading...</p>
			{:then newsItems}
				{#if !newsItems || newsItems.length === 0}
					<p class="no-news-message">ニュースが取得できません</p>
				{:else}
					<div class="article-info-container">
						{#each newsItems as item, index (item.id)}
							<div
								class="article-info"
								class:active={currentIndex === index}
								class:exiting={previousIndex === index}
							>
								<p class="date">{item.publishedAt ? formatDate(item.publishedAt) : ''}</p>
								<a
									href={resolve(`/news/${item.id}`)}
									class="article-link"
								>
									<h3 class="article-title">{item.title ?? ''}</h3>
									<p class="article-description">
										{item.content ? truncate(stripHtml(item.content), 100) : ''}
									</p>
								</a>
							</div>
						{/each}
					</div>
				{/if}
			{:catch}
				<p class="no-news-message">ニュースが取得できません</p>
			{/await}
		</div>
		<div class="carousel">
			{#await newsPromise}
				<p>Loading...</p>
			{:then newsItems}
				{#if !newsItems || newsItems.length === 0}
					<p class="no-news-message">ニュースが取得できません</p>
				{:else}
					<NewsCarousel
						items={newsItems}
						bind:currentIndex
					/>
				{/if}
			{:catch}
				<p class="no-news-message">ニュースが取得できません</p>
			{/await}
		</div>
	</div>
	<div class="wide-content link-button">
		<NewsLink
			href="/news"
			textContent="VIEW ALL"
		/>
	</div>

	<PinnedNews />
</section>

<style>
#news {
	margin-top: 10rem;
}

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
	font-family: 'Noto Sans JP Regular', sans-serif;
	font-size: 20px;
	line-height: 29px;
	color: #3c87c0;
}

.article-info-container {
	position: relative;
	height: 150px;
	margin-top: 31px;
	/* 子要素(.article-info)がposition: absoluteのため、
	   width: 100%を継承させるには親に明示的な幅が必要 */
	width: 100%;
}

.article-info {
	position: absolute;
	top: 0;
	left: 0;
	opacity: 0;
	transition: opacity 0.4s ease;
	width: 100%;
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
	color: #3c87c0;
	letter-spacing: 0.02em;
	max-width: calc(100vw - var(--wide-content-space) * 2);
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
	width: 400px;
	max-width: calc(100vw - var(--wide-content-space) * 2);
}

.article-description {
	display: -webkit-box;
	width: 360px;
	max-width: calc(100vw - var(--wide-content-space) * 2);
	overflow: hidden;
	-webkit-line-clamp: 4;
	line-clamp: 4;
	font-family: var(--font-body);
	font-size: 12px;
	line-height: 19px;
	letter-spacing: 0.08em;
	-webkit-box-orient: vertical;
}

.article-link {
	display: block;
	color: inherit;
	text-decoration: none;
}

.article-link:hover {
	opacity: 0.7;
}

.carousel {
	width: 100%;
}

.link-button {
	margin-top: 44px;
}

@media screen and (width >= 768px) {
	#news {
		margin-top: 300px;
	}
}

@media (width >= 1070px) {
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
		width: 384px;
	}
}
</style>
