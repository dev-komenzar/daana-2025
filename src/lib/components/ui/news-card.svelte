<script lang="ts">
	import type { NewsItem } from "$lib/cms";

	import { resolve } from "$app/paths";

	interface Properties {
		item: NewsItem;
	}

	let { item }: Properties = $props();

	const formattedDate = $derived(() => {
		if (!item.publishedAt) return '';
		const date = new Date(item.publishedAt);
		return date.toLocaleDateString('ja-JP', { day: '2-digit', month: '2-digit', year: 'numeric' });
	});
</script>

<a href={resolve(`/news/${item.id}`)} class="news-card">
	{#if item.thumbnail?.url}
		<div class="card-thumbnail">
			<img
				src={item.thumbnail.url}
				alt={item.title || 'ニュースのサムネイル'}
				width={item.thumbnail.width}
				height={item.thumbnail.height}
			/>
		</div>
	{:else}
		<div class="card-thumbnail placeholder">
			<span class="placeholder-text">No Image</span>
		</div>
	{/if}
	<div class="card-content">
		<time class="card-date" datetime={item.publishedAt}>{formattedDate()}</time>
		<h3 class="card-title">{item.title || '無題'}</h3>
	</div>
</a>

<style>
	.news-card {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		cursor: pointer;
		background-color: white;
		border-radius: 16px;
		box-shadow: 0 4px 12px rgb(0 0 0 / 8%);
		text-decoration: none;
		color: inherit;
		transition: transform 0.3s ease, box-shadow 0.3s ease;
	}

	.news-card:hover {
		box-shadow: 0 8px 24px rgb(0 0 0 / 12%);
		transform: translateY(-4px);
	}

	.card-thumbnail {
		position: relative;
		width: 100%;
		height: 200px;
		overflow: hidden;
		background-color: #f5f5f5;
	}

	.card-thumbnail img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.3s ease;
	}

	.news-card:hover .card-thumbnail img {
		transform: scale(1.05);
	}

	.card-thumbnail.placeholder {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.placeholder-text {
		font-size: 16px;
		color: #999;
	}

	.card-content {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 20px;
	}

	.card-date {
		font-family: "Noto Sans JP Light", sans-serif;
		font-size: 14px;
		color: #666;
	}

	.card-title {
		display: -webkit-box;
		margin: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		font-family: "Noto Sans JP Bold", sans-serif;
		font-size: 18px;
		font-weight: bold;
		line-height: 1.5;
		color: #333;
		-webkit-box-orient: vertical;
	}

	@media (width >= 768px) {
		.card-thumbnail {
			height: 220px;
		}

		.card-title {
			font-size: 20px;
		}
	}
</style>
