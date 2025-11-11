<script lang="ts">
	import { resolve } from '$app/paths';
	import NewsDetailSkeleton from '$lib/components/ui/news-detail-skeleton.svelte';
	import { MetaTags } from 'svelte-meta-tags';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function formatDate(dateString: string | undefined): string {
		if (!dateString) return '';
		const date = new Date(dateString);
		return date.toLocaleDateString('ja-JP', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		});
	}
</script>

{#await data.newsPost}
	<MetaTags
		title='ニュース'
		titleTemplate='%s | 実験寺院 寳幢寺'
	/>
	<NewsDetailSkeleton />
{:then newsPost}
	<MetaTags
		title={newsPost.title || 'ニュース'}
		titleTemplate='%s | 実験寺院 寳幢寺'
	/>

	<article class="container">
		<div class="content">
			<header class="article-header">
				{#if newsPost.publishedAt}
					<time datetime={newsPost.publishedAt} class="publish-date">
						{formatDate(newsPost.publishedAt)}
					</time>
				{/if}
				{#if newsPost.title}
					<h1 class="article-title">{newsPost.title}</h1>
				{/if}
			</header>

			{#if newsPost.thumbnail}
				<div class="thumbnail">
					<img
						src={newsPost.thumbnail.url}
						alt={newsPost.title || 'ニュース画像'}
						width={newsPost.thumbnail.width}
						height={newsPost.thumbnail.height}
					/>
				</div>
			{/if}

			{#if newsPost.content}
				<div class="article-content">
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html newsPost.content}
				</div>
			{/if}

			<div class="back-link">
				<a href={resolve('/news')}>← ニュース一覧に戻る</a>
			</div>
		</div>
	</article>
{:catch}
	<MetaTags
		title='エラー'
		titleTemplate='%s | 実験寺院 寳幢寺'
	/>
	<article class="container">
		<div class="content">
			<div class="error-message">
				<p>ニュースの読み込みに失敗しました。</p>
			</div>
			<div class="back-link">
				<a href={resolve('/news')}>← ニュース一覧に戻る</a>
			</div>
		</div>
	</article>
{/await}

<style>
	.content {
		padding: 2rem 1rem;
	}

	.article-header {
		margin-bottom: 2rem;
		text-align: center;
	}

	.publish-date {
		display: block;
		margin-bottom: 1rem;
		font-family: var(--font-gothic-light);
		font-size: 14px;
		color: #666;
	}

	.article-title {
		margin: 0;
		font-family: var(--font-gothic-bold);
		font-size: 28px;
		font-weight: bold;
		line-height: 1.5;
		color: #000;
	}

	.thumbnail {
		margin: 2rem 0;
		overflow: hidden;
		border-radius: 8px;
	}

	.thumbnail img {
		display: block;
		width: 100%;
		height: auto;
	}

	.article-content {
		margin: 2rem 0;
		font-family: var(--font-gothic);
		font-size: 16px;
		line-height: 1.8;
		color: #333;
	}

	.article-content :global(h2) {
		margin: 2rem 0 1rem;
		font-family: var(--font-gothic-bold);
		font-size: 24px;
		font-weight: bold;
		line-height: 1.5;
		color: #000;
	}

	.article-content :global(h3) {
		margin: 1.5rem 0 0.75rem;
		font-family: var(--font-gothic-medium);
		font-size: 20px;
		font-weight: 600;
		line-height: 1.5;
		color: #000;
	}

	.article-content :global(p) {
		margin: 1rem 0;
	}

	.article-content :global(a) {
		color: var(--color-primary);
		text-decoration: underline;
	}

	.article-content :global(a:hover) {
		color: var(--color-accent);
	}

	.article-content :global(img) {
		max-width: 100%;
		height: auto;
		margin: 1rem 0;
		border-radius: 4px;
	}

	.back-link {
		padding-top: 2rem;
		margin-top: 3rem;
		text-align: center;
		border-top: 1px solid #eee;
	}

	.back-link a {
		font-family: var(--font-gothic);
		font-size: 16px;
		color: var(--color-primary);
		text-decoration: none;
		transition: color 0.3s ease;
	}

	.back-link a:hover {
		color: var(--color-accent);
	}

	.error-message {
		padding: 40px 20px;
		text-align: center;
	}

	.error-message p {
		font-family: var(--font-gothic-light);
		font-size: 16px;
		color: #d32f2f;
	}

	@media (width >= 768px) {
		.content {
			padding: 3rem 2rem;
		}

		.article-title {
			font-size: 36px;
		}

		.publish-date {
			font-size: 16px;
		}

		.article-content {
			font-size: 18px;
		}

		.article-content :global(h2) {
			font-size: 28px;
		}

		.article-content :global(h3) {
			font-size: 24px;
		}
	}
</style>
