<script lang="ts">
import { resolve } from '$app/paths'
import NewsCard from '$lib/components/ui/news-card.svelte'

import type { PageData } from './$types'

type PaginationEntry = { id: string; kind: 'ellipsis' } | { kind: 'page'; page: number }

let { data }: { data: PageData } = $props()

function buildPagination(current: number, total: number): PaginationEntry[] {
	const pages: number[] = [1, total]
	for (let page = Math.max(1, current - 2); page <= Math.min(total, current + 2); page++) {
		if (!pages.includes(page)) pages.push(page)
	}

	const sortedPages = pages.toSorted((a, b) => a - b)
	const entries: PaginationEntry[] = []
	let previousPage = 0
	for (const page of sortedPages) {
		if (page - previousPage > 1) {
			entries.push({ id: `ellipsis-${previousPage}-${page}`, kind: 'ellipsis' })
		}
		entries.push({ kind: 'page', page })
		previousPage = page
	}
	return entries
}

const paginationItems = $derived(buildPagination(data.currentPage, data.totalPages))

// 1ページ目は ?page=1 を付けず clean URL にする。
function pageHref(page: number): string {
	return resolve(`/news${page === 1 ? '' : `?page=${page}`}` as '/')
}
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -- href は pageHref() 経由で resolve() を通している -->
<div class="news-page">
	<div class="container">
		<div class="wide-content">
			<header class="page-header">
				<h1 class="page-title text-large font-gothic-bold">News</h1>
				<p class="page-subtitle">お知らせ一覧</p>
			</header>

			{#if data.newsItems.length === 0}
				<div class="empty-message">
					<p>まだニュースがありません。</p>
				</div>
			{:else}
				<div class="news-list">
					{#each data.newsItems as item (item.id)}
						<NewsCard {item} />
					{/each}
				</div>

				{#if data.totalPages > 1}
					<nav
						class="pagination"
						aria-label="ページネーション"
					>
						{#if data.currentPage > 1}
							<a
								class="pagination-nav"
								href={pageHref(data.currentPage - 1)}
								data-sveltekit-preload-data="tap">前へ</a
							>
						{/if}
						<div class="pagination-pages">
							{#each paginationItems as entry (entry.kind === 'page' ? entry.page : entry.id)}
								{#if entry.kind === 'ellipsis'}
									<span class="pagination-ellipsis">…</span>
								{:else}
									<a
										class="pagination-page"
										class:active={entry.page === data.currentPage}
										href={pageHref(entry.page)}
										data-sveltekit-preload-data="tap"
										aria-current={entry.page === data.currentPage ? 'page' : undefined}>{entry.page}</a
									>
								{/if}
							{/each}
						</div>
						{#if data.currentPage < data.totalPages}
							<a
								class="pagination-nav"
								href={pageHref(data.currentPage + 1)}
								data-sveltekit-preload-data="tap">次へ</a
							>
						{/if}
					</nav>
				{/if}
			{/if}
		</div>
	</div>
</div>

<style>
.news-page {
	min-height: 100vh;
	padding: 120px 0 80px;
	background-color: var(--color-white);
}

.page-header {
	text-align: center;
}

.page-header > * + * {
	margin-top: 16px;
}

.page-title {
	color: var(--color-primary);
}

.page-subtitle {
	font-family: var(--font-body-light);
	font-size: 16px;
	color: var(--color-accent-blue);
}

.news-list {
	margin-top: 48px;
}

.empty-message {
	margin-top: 48px;
	text-align: center;
}

.empty-message p {
	font-family: var(--font-body-light);
	font-size: 16px;
	color: color-mix(in srgb, var(--color-text) 50%, var(--color-white));
}

.pagination {
	display: flex;
	flex-wrap: wrap;
	gap: 16px;
	align-items: center;
	justify-content: center;
	margin-top: 48px;
}

.pagination-pages {
	display: flex;
	gap: 8px;
	align-items: center;
}

.pagination-page {
	display: flex;
	align-items: center;
	justify-content: center;
	min-width: 40px;
	height: 40px;
	font-family: var(--font-body);
	font-size: 14px;
	color: var(--color-primary);
	text-decoration: none;
	border: 1px solid var(--color-secondary);
	border-radius: 8px;
	transition:
		color 0.2s ease,
		border-color 0.2s ease,
		background-color 0.2s ease;
}

.pagination-page:hover {
	color: var(--color-accent-blue);
	border-color: var(--color-accent-blue);
}

.pagination-page.active {
	color: var(--color-white);
	pointer-events: none;
	background-color: var(--color-primary);
	border-color: var(--color-primary);
}

.pagination-ellipsis {
	color: var(--color-secondary);
}

.pagination-nav {
	font-family: var(--font-body-medium);
	font-size: 14px;
	color: var(--color-primary);
	text-decoration: none;
	transition: color 0.2s ease;
}

.pagination-nav:hover {
	color: var(--color-accent-blue);
}

@media (width >= 768px) {
	.news-page {
		padding: 140px 0 100px;
	}

	.page-subtitle {
		font-size: 18px;
	}
}
</style>
