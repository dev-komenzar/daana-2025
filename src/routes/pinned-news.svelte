<script lang="ts">
import type { NewsItem } from '$lib/news'

import { resolve } from '$app/paths'
import { stripHtml, truncate } from '$lib/utils/description'

let { pinnedNewsItems }: { pinnedNewsItems: NewsItem[] } = $props()
</script>

<div class="full-content">
	{#each pinnedNewsItems as item (item.id)}
		{#if item.content}
			{@const description = truncate(stripHtml(item.content), 35)}
			{@const resolvedLink = resolve('/news/[slug]', { slug: item.id })}
			<a
				href={resolvedLink}
				class="row"
			>
				<div class="article-info">
					<div class="date">{item.publishedAt}</div>
					<div class="article-title">{item.title}</div>
					<div class="article-description">{description}</div>
				</div>

				{#if item.thumbnail && item.thumbnail.url}
					<div class="image-wrapper">
						<svg
							class="icon"
							width="34"
							height="34"
							viewBox="0 0 34 34"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<circle
								cx="17"
								cy="17"
								r="16.25"
								fill="white"
								stroke="black"
								stroke-width="1.5"
							/>
							<path
								d="M16.7356 10.2585C17.0871 9.91383 17.6579 9.91383 18.0094 10.2585L23.7364 15.876C24.0879 16.2206 24.0879 16.7794 23.7364 17.124L18.0094 22.7415C17.6579 23.0862 17.0871 23.0862 16.7356 22.7415C16.3841 22.3968 16.3841 21.837 16.7356 21.4923L20.9274 17.3826H9.9C9.40295 17.3826 9 16.9875 9 16.5C9 16.0125 9.40295 15.6174 9.9 15.6174H20.9274L16.7356 11.5077C16.3841 11.163 16.3841 10.6032 16.7356 10.2585Z"
								fill="black"
							/>
						</svg>

						<img
							src={item.thumbnail.url}
							alt={description}
							class="thumbnail"
						/>
					</div>
				{/if}
			</a>
		{:else}
			<p>本文がありません。</p>
		{/if}
	{/each}
</div>

<style>
.full-content {
	margin-top: 95px;
}

.row {
	display: grid;
	grid-template-rows: 1fr 1fr;
	width: 100%;
	color: black;
	text-decoration: none;
	border-top: 1px dashed;
}

.row:last-child {
	border-bottom: 1px dashed;
}

.article-info {
	padding-right: var(--wide-content-space);
	padding-left: var(--wide-content-space);
	margin-top: 16px;
}

.date {
	/* 2025.01.01 */
	font-family: var(--font-heading-bold);
	font-size: 11px;
	line-height: 16px;
	color: #3c87c0;
	letter-spacing: 0.02em;
}

.article-title {
	display: -webkit-box;
	overflow: hidden;
	-webkit-line-clamp: 1;
	line-clamp: 1;
	font-family: var(--font-body-bold);
	font-size: 19px;
	line-height: 28px;
	letter-spacing: 0.08em;
	-webkit-box-orient: vertical;
}

.article-description {
	display: -webkit-box;
	overflow: hidden;
	-webkit-line-clamp: 4;
	line-clamp: 4;
	font-family: var(--font-body);
	font-size: 12px;
	line-height: 19px;
	letter-spacing: 0.08em;
	-webkit-box-orient: vertical;
}

.image-wrapper {
	position: relative;
	width: 100%;
	max-width: 425px;
	height: 94px;
	margin: 0 auto;
}

.icon {
	position: absolute;
	top: 50%;
	left: 32px;
	transform: translate(0%, -50%);
}

.thumbnail {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

@media screen and (width >= 1024px) {
	.row {
		display: grid;
		grid-template-rows: none;
		grid-template-columns: 1fr 1fr;
		width: 100%;
	}

	.article-info {
		padding-right: 0;
	}

	.image-wrapper {
		max-width: none;
		margin: 0;
	}
}
</style>
