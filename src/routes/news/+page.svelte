<script lang="ts">
import type { NewsItem } from '$lib/cms'

import NewsCardSkeleton from '$lib/components/ui/news-card-skeleton.svelte'
import NewsCard from '$lib/components/ui/news-card.svelte'
import { getNewsRemote, getNewsTotalCountRemote } from '$lib/news.remote'

const ITEMS_PER_PAGE = 10

// Initial load - same pattern as section-news.svelte
const query = getNewsRemote({
	fields: ['id', 'title', 'publishedAt', 'thumbnail'],
	limit: ITEMS_PER_PAGE,
	offset: 0,
})

// Get total count
const totalCountQuery = getNewsTotalCountRemote()

let allNewsItems = $state<NewsItem[]>([])
let isLoadingMore = $state(false)

// Track if there are more items to load based on totalCount
const hasMoreItems = $derived(() => {
	if (query.loading || query.error) return false
	if (!query.current) return false
	if (totalCountQuery.loading || totalCountQuery.error || !totalCountQuery.current) return false

	const currentItemCount = allNewsItems.length > 0 ? allNewsItems.length : query.current.length
	return currentItemCount < totalCountQuery.current
})

// Merge initial query results with loaded items
const displayedItems = $derived(() => {
	if (allNewsItems.length > 0) {
		return allNewsItems
	}
	return query.current || []
})

async function loadMore() {
	if (isLoadingMore) return

	isLoadingMore = true

	try {
		const currentOffset = allNewsItems.length > 0 ? allNewsItems.length : ITEMS_PER_PAGE

		const moreNews = await getNewsRemote({
			fields: ['id', 'title', 'publishedAt', 'thumbnail'],
			limit: ITEMS_PER_PAGE,
			offset: currentOffset,
		})

		if (moreNews && moreNews.length > 0) {
			// Merge initial items with new items
			allNewsItems = allNewsItems.length === 0 && query.current ? [...query.current, ...moreNews] : [...allNewsItems, ...moreNews]
		}
	} catch (error) {
		console.error('Failed to load more news:', error)
	} finally {
		isLoadingMore = false
	}
}
</script>

<div class="news-page">
	<div class="container">
		<header class="page-header">
			<h1 class="page-title text-large font-gothic-bold">NEWS</h1>
			<p class="page-subtitle">お知らせ一覧</p>
		</header>

		{#if query.error}
			<div class="error-message">
				<p>ニュースの読み込みに失敗しました。</p>
			</div>
		{:else if query.loading}
			<div class="news-grid">
				{#each [0, 1, 2] as index (index)}
					<NewsCardSkeleton />
				{/each}
			</div>
		{:else if displayedItems().length === 0}
			<div class="empty-message">
				<p>まだニュースがありません。</p>
			</div>
		{:else}
			<div class="news-grid">
				{#each displayedItems() as item (item.id)}
					<NewsCard {item} />
				{/each}
			</div>

			{#if hasMoreItems()}
				<div class="load-more-container">
					<button
						class="load-more-button"
						onclick={loadMore}
						disabled={isLoadingMore}
					>
						{isLoadingMore ? '読み込み中...' : 'さらに読み込む'}
					</button>
				</div>
			{/if}
		{/if}
	</div>
</div>

<style>
.news-page {
	min-height: 100vh;
	padding: 120px 0 80px;
	background-color: #fafafa;
}

.container {
	width: 100%;
	max-width: 1200px;
	padding: 0 20px;
	margin: 0 auto;
}

.page-header {
	margin-bottom: 60px;
	text-align: center;
}

.page-title {
	margin: 0 0 16px;
	font-size: 48px;
	color: #333;
}

.page-subtitle {
	margin: 0;
	font-family: 'Noto Sans JP Light', sans-serif;
	font-size: 18px;
	color: #666;
}

.news-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
	gap: 32px;
	margin-bottom: 40px;
}

.error-message,
.empty-message {
	padding: 40px 20px;
	text-align: center;
}

.error-message p {
	font-family: 'Noto Sans JP Light', sans-serif;
	font-size: 16px;
	color: #d32f2f;
}

.empty-message p {
	font-family: 'Noto Sans JP Light', sans-serif;
	font-size: 16px;
	color: #999;
}

.load-more-container {
	display: flex;
	justify-content: center;
	padding: 40px 0;
}

.load-more-button {
	padding: 16px 48px;
	font-family: 'Noto Sans JP Regular', sans-serif;
	font-size: 16px;
	color: white;
	cursor: pointer;
	background-color: var(--color-primary);
	border: none;
	border-radius: 8px;
	transition:
		background-color 0.3s ease,
		transform 0.2s ease;
}

.load-more-button:disabled {
	cursor: not-allowed;
	background-color: #ccc;
	opacity: 0.6;
}

.load-more-button:hover:not(:disabled) {
	background-color: var(--color-secondary);
	transform: translateY(-2px);
}

@media (width >= 768px) {
	.news-page {
		padding: 140px 0 100px;
	}

	.page-header {
		margin-bottom: 80px;
	}

	.page-title {
		font-size: 64px;
	}

	.page-subtitle {
		font-size: 20px;
	}

	.news-grid {
		gap: 40px;
	}
}

@media (width >= 1024px) {
	.news-grid {
		grid-template-columns: repeat(3, 1fr);
	}
}
</style>
