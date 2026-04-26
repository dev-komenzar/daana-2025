<script lang="ts">
import { resolve } from '$app/paths'
import { MetaTags } from 'svelte-meta-tags'

import type { PageData } from './$types'

type Properties = { data: PageData }
let { data }: Properties = $props()

function paginationHref(pageNumber: number) {
	// eslint-disable-next-line svelte/prefer-svelte-reactivity -- 非リアクティブな純関数。URLSearchParams で十分
	const parameters = new URLSearchParams()
	parameters.set('page', String(pageNumber))
	if (data.q) parameters.set('q', data.q)
	return `${resolve('/cms/media')}?${parameters.toString()}`
}
</script>

<MetaTags title="メディア" />

<h1>メディア</h1>

<a
	href={resolve('/cms/media/upload')}
	data-testid="upload-link">+ アップロード</a
>

<form
	method="GET"
	action={resolve('/cms/media')}
	class="media-search"
>
	<label>
		検索
		<input
			type="search"
			name="q"
			value={data.q}
			placeholder="ファイル名・alt・キャプション"
		/>
	</label>
	<button type="submit">検索</button>
</form>

{#if data.items.length === 0}
	<p class="empty">該当するメディアがありません</p>
{:else}
	<ul class="media-grid">
		{#each data.items as item (item.id)}
			<li class="media-card">
				<img
					src={item.thumbUrl}
					alt={item.alt}
					width={item.width}
					height={item.height}
				/>
				<p
					class="filename"
					title={item.fileName}
				>
					{item.fileName}
				</p>
			</li>
		{/each}
	</ul>
{/if}

{#if data.totalPages > 1}
	<nav
		class="pagination"
		aria-label="ページング"
	>
		{#if data.page > 1}
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- query 文字列のみ動的 -->
			<a
				href={paginationHref(data.page - 1)}
				rel="prev">前へ</a
			>
		{/if}
		<span>{data.page} / {data.totalPages}</span>
		{#if data.page < data.totalPages}
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- query 文字列のみ動的 -->
			<a
				href={paginationHref(data.page + 1)}
				rel="next">次へ</a
			>
		{/if}
	</nav>
{/if}

<style>
.media-search {
	display: flex;
	gap: 8px;
	align-items: end;
	margin: 16px 0;
}

.media-search label {
	display: flex;
	flex: 1;
	flex-direction: column;
	gap: 4px;
	font-size: 14px;
}

.media-search input {
	padding: 8px 10px;
	border: 1px solid #ccc;
	border-radius: 4px;
}

.media-search button {
	padding: 8px 16px;
	color: #fff;
	cursor: pointer;
	background: var(--color-primary, #222);
	border: none;
	border-radius: 4px;
}

.media-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
	gap: 12px;
	padding: 0;
	list-style: none;
}

.media-card img {
	display: block;
	width: 100%;
	height: auto;
	aspect-ratio: 1;
	object-fit: cover;
	border: 1px solid #ddd;
	border-radius: 4px;
}

.filename {
	overflow: hidden;
	font-size: 12px;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.pagination {
	display: flex;
	gap: 12px;
	align-items: center;
	margin-top: 16px;
}

.empty {
	padding: 32px;
	color: #666;
	text-align: center;
}
</style>
