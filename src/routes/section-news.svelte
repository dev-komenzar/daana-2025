<script lang="ts">
import type { NewsItem } from '$lib/news'

import { resolve } from '$app/paths'
import NewsLink from '$lib/components/ui/news-link.svelte'
import { stripHtml, truncate } from '$lib/utils/description'

import PinnedNews from './pinned-news.svelte'

let { newsItems, pinnedNewsItems }: { newsItems: NewsItem[]; pinnedNewsItems: NewsItem[] } = $props()

// Pick Up 表示は最新1件のみ
const latestNews = $derived(newsItems?.at(0))

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

			{#if !latestNews}
				<p class="no-news-message">ニュースが取得できません</p>
			{:else}
				<div class="article-info">
					<p class="date">{latestNews.publishedAt ? formatDate(latestNews.publishedAt) : ''}</p>
					<a
						href={resolve(`/news/${latestNews.id}`)}
						class="article-link"
					>
						<h3 class="article-title">{latestNews.title ?? ''}</h3>
						<p class="article-description">
							{latestNews.content ? truncate(stripHtml(latestNews.content), 100) : ''}
						</p>
					</a>
				</div>
			{/if}
		</div>
		{#if latestNews}
			<div class="carousel">
				<a
					href={resolve(`/news/${latestNews.id}`)}
					class="carousel-slide"
					style:background-image={latestNews.thumbnail?.url ? `url(${latestNews.thumbnail.url})` : 'none'}
					data-sveltekit-preload-data="tap"
				>
					<div class="slide-overlay">
						<h3 class="slide-title">{latestNews.title}</h3>
					</div>
				</a>
			</div>
		{/if}
	</div>
	<div class="wide-content link-button">
		<NewsLink
			href="/news"
			textContent="VIEW ALL"
		/>
	</div>

	<PinnedNews {pinnedNewsItems} />
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

.article-info {
	width: 100%;
	margin-top: 31px;
}

.date {
	max-width: calc(100vw - var(--wide-content-space) * 2);

	/* 2025.01.01 */
	font-family: var(--font-heading-bold);
	font-size: 14px;
	line-height: 16px;
	color: #3c87c0;
	letter-spacing: 0.02em;
}

.article-title {
	display: -webkit-box;
	width: 400px;
	max-width: calc(100vw - var(--wide-content-space) * 2);
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
	max-width: calc(100vw - var(--wide-content-space) * 2);
	overflow: hidden;
	-webkit-line-clamp: 4;
	line-clamp: 4;
	font-family: var(--font-body);
	font-size: 14px;
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
	height: 400px;
	overflow: hidden;
	border-radius: 24px;
}

.carousel-slide {
	position: relative;
	display: block;
	width: 100%;
	height: 100%;
	color: inherit;
	text-decoration: none;
	background-position: center;
	background-size: cover;
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

.link-button {
	margin-top: 44px;
}

@media screen and (width >= 768px) {
	#news {
		margin-top: 300px;
	}

	.carousel {
		height: 370px;
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
