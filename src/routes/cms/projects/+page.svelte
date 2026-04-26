<script lang="ts">
import { resolve } from '$app/paths'
import { MetaTags } from 'svelte-meta-tags'

import type { PageData } from './$types'

type Properties = { data: PageData }
let { data }: Properties = $props()

function formatDate(iso: string | undefined): string {
	if (!iso) return '—'
	return iso.slice(0, 10)
}

function formatType(type: string[] | undefined): string {
	if (!type || type.length === 0) return '—'
	return type.join(', ')
}

function confirmDelete(event: SubmitEvent) {
	if (!confirm('削除しますか？')) event.preventDefault()
}
</script>

<MetaTags title="プロジェクト" />

<h1>プロジェクト</h1>

<a
	href={resolve('/cms/projects/new')}
	data-testid="create-link">新規作成</a
>

<table class="projects-table">
	<thead>
		<tr>
			<th>タイトル</th>
			<th>タイプ</th>
			<th>状態</th>
			<th>公開日</th>
			<th>操作</th>
		</tr>
	</thead>
	<tbody>
		{#each data.items as item (item.id)}
			<tr>
				<td>{item.title ?? '(無題)'}</td>
				<td>{formatType(item.type)}</td>
				<td>
					{#if item.draft}<span
							class="badge badge--draft"
							data-testid="badge-draft-{item.id}">下書き</span
						>{/if}
				</td>
				<td>{formatDate(item.published_at)}</td>
				<td>
					<a
						href={resolve(`/cms/projects/${item.id}/edit`)}
						data-testid="edit-link-{item.id}">編集</a
					>
					<form
						method="POST"
						action="?/delete"
						class="delete-form"
						onsubmit={confirmDelete}
					>
						<input
							type="hidden"
							name="id"
							value={item.id}
						/>
						<button
							type="submit"
							data-testid="delete-button">削除</button
						>
					</form>
				</td>
			</tr>
		{/each}
	</tbody>
</table>

{#if data.totalPages > 1}
	<nav
		class="pagination"
		aria-label="ページング"
	>
		{#if data.page > 1}
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- ページ遷移先のパスは resolve() 済み、query 文字列のみ動的 -->
			<a
				href={`${resolve('/cms/projects')}?page=${data.page - 1}`}
				rel="prev"
				data-testid="page-prev">前へ</a
			>
		{/if}
		<span>{data.page} / {data.totalPages}</span>
		{#if data.page < data.totalPages}
			<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- ページ遷移先のパスは resolve() 済み、query 文字列のみ動的 -->
			<a
				href={`${resolve('/cms/projects')}?page=${data.page + 1}`}
				rel="next"
				data-testid="page-next">次へ</a
			>
		{/if}
	</nav>
{/if}

<style>
.projects-table {
	width: 100%;
	border-collapse: collapse;
	margin-top: 16px;
}

.projects-table th,
.projects-table td {
	padding: 8px 12px;
	text-align: left;
	border-bottom: 1px solid #ddd;
}

.badge {
	display: inline-block;
	padding: 2px 8px;
	margin-right: 4px;
	font-size: 12px;
	border-radius: 12px;
}

.badge--draft {
	color: #7a0000;
	background: #fdd;
}

.pagination {
	display: flex;
	gap: 12px;
	align-items: center;
	margin-top: 16px;
}

.delete-form {
	display: inline;
}
</style>
