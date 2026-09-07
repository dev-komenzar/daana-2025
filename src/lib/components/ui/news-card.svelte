<script lang="ts">
import type { NewsItem } from '$lib/news'

import { resolve } from '$app/paths'

interface Properties {
	item: NewsItem
}

let { item }: Properties = $props()

const formattedDate = $derived(() => {
	if (!item.publishedAt) return ''
	const date = new Date(item.publishedAt)
	return date.toLocaleDateString('ja-JP', { day: '2-digit', month: '2-digit', year: 'numeric' })
})
</script>

<a
	href={resolve(`/news/${item.id}`)}
	class="news-row"
	data-sveltekit-preload-data="tap"
>
	{#if item.thumbnail?.url}
		<div class="row-thumbnail">
			<img
				src={item.thumbnail.url}
				alt={item.title || 'ニュースのサムネイル'}
				width={item.thumbnail.width}
				height={item.thumbnail.height}
			/>
		</div>
	{:else}
		<div class="row-thumbnail placeholder">
			<span class="placeholder-text">No Image</span>
		</div>
	{/if}
	<div class="row-content">
		<time
			class="row-date"
			datetime={item.publishedAt}>{formattedDate()}</time
		>
		<h3 class="row-title">{item.title || '無題'}</h3>
	</div>
</a>

<style>
.news-row {
	display: flex;
	gap: 16px;
	align-items: center;
	padding: 16px 0;
	color: inherit;
	text-decoration: none;
	border-bottom: 1px solid var(--color-secondary);
}

.row-thumbnail {
	flex-shrink: 0;
	width: 160px;
	aspect-ratio: 4 / 3;
	overflow: hidden;
	background-color: color-mix(in srgb, var(--color-text) 8%, var(--color-white));
}

.row-thumbnail img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	transition: transform 0.3s ease;
}

.news-row:hover .row-thumbnail img {
	transform: scale(1.05);
}

.row-thumbnail.placeholder {
	display: flex;
	align-items: center;
	justify-content: center;
}

.placeholder-text {
	font-family: var(--font-body-light);
	font-size: 12px;
	color: color-mix(in srgb, var(--color-text) 40%, var(--color-white));
}

.row-content {
	display: flex;
	flex-direction: column;
	gap: 8px;
	min-width: 0;
}

.row-date {
	font-family: var(--font-heading-bold);
	font-size: 14px;
	line-height: 16px;
	color: var(--color-accent-blue);
	letter-spacing: 0.02em;
}

.row-title {
	display: -webkit-box;
	overflow: hidden;
	-webkit-line-clamp: 2;
	line-clamp: 2;
	font-family: var(--font-body-bold);
	font-size: 16px;
	line-height: 1.5;
	color: var(--color-text);
	-webkit-box-orient: vertical;
	transition: color 0.2s ease;
}

.news-row:hover .row-title {
	color: var(--color-accent-blue);
}

@media (width >= 768px) {
	.news-row {
		gap: 24px;
		padding: 24px 0;
	}

	.row-thumbnail {
		width: 200px;
	}

	.row-title {
		font-size: 18px;
	}
}
</style>
