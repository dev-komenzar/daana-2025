<script lang="ts">
import { resolve } from '$app/paths'
import { untrack } from 'svelte'

import MediaGrid, { type MediaItem } from './media-grid.svelte'

type Properties = {
	initialId?: string | undefined
	initialThumbUrl?: string | undefined
	mediaItems: MediaItem[]
	name: string
}

let { initialId, initialThumbUrl, mediaItems, name }: Properties = $props()

let selectedId = $state(untrack(() => initialId ?? ''))
let modalOpen = $state(false)
let allItems = $state(untrack(() => mediaItems))
let currentPage = $state(1)
let totalPages = $state<number>(1)
let dialog = $state<HTMLDialogElement | undefined>()

const selectedThumbUrl = $derived(selectedId ? (allItems.find(index => index.id === selectedId)?.thumbUrl ?? initialThumbUrl ?? '') : '')

$effect(() => {
	if (!dialog) return
	if (modalOpen && !dialog.open) dialog.showModal()
	if (!modalOpen && dialog.open) dialog.close()
})

async function loadMore() {
	if (currentPage >= totalPages) return
	const nextPage = currentPage + 1
	const response = await fetch(`/api/cms/media?page=${nextPage}`)
	if (!response.ok) return
	const data = (await response.json()) as { items: MediaItem[]; page: number; totalPages: number }
	allItems = [...allItems, ...data.items]
	currentPage = data.page
	totalPages = data.totalPages
}

function selectItem(item: MediaItem) {
	selectedId = item.id
	modalOpen = false
}

function clearSelection() {
	selectedId = ''
}

function handleDialogClick(event: MouseEvent) {
	if (event.target === dialog) modalOpen = false
}
</script>

<div class="thumbnail-picker">
	<div class="preview-area">
		{#if selectedThumbUrl}
			<img
				class="preview-img"
				src={selectedThumbUrl}
				alt="選択中のサムネイル"
			/>
			<button
				type="button"
				class="clear-btn"
				aria-label="サムネイルを解除"
				onclick={clearSelection}>×</button
			>
		{:else}
			<div class="placeholder">
				<span class="placeholder-text">サムネイル未選択</span>
			</div>
		{/if}
	</div>
	<button
		type="button"
		class="select-btn"
		onclick={() => (modalOpen = true)}>選択する</button
	>
</div>

<input
	type="hidden"
	{name}
	value={selectedId}
/>

<dialog
	bind:this={dialog}
	aria-label="サムネイルを選択"
	onclick={handleDialogClick}
	onclose={() => (modalOpen = false)}
>
	<header>
		<h2>サムネイルを選択</h2>
		<a
			href={resolve('/cms/media/upload')}
			target="_blank"
			rel="noopener"
			class="upload-link">新規アップロード</a
		>
		<button
			type="button"
			aria-label="閉じる"
			onclick={() => (modalOpen = false)}>×</button
		>
	</header>
	<MediaGrid
		items={allItems}
		{selectedId}
		onselect={selectItem}
		onloadmore={loadMore}
	/>
</dialog>

<style>
.thumbnail-picker {
	display: flex;
	gap: 12px;
	align-items: center;
}

.preview-area {
	position: relative;
	width: 120px;
	height: 120px;
	overflow: hidden;
	border: 1px solid #ccc;
	border-radius: 4px;
}

.preview-img {
	width: 100%;
	height: 100%;
	object-fit: cover;
}

.clear-btn {
	position: absolute;
	top: 4px;
	right: 4px;
	width: 22px;
	height: 22px;
	padding: 0;
	font-size: 13px;
	line-height: 1;
	color: #fff;
	cursor: pointer;
	background: rgb(0 0 0 / 50%);
	border: none;
	border-radius: 50%;
}

.placeholder {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	background: #f5f5f5;
}

.placeholder-text {
	font-size: 12px;
	color: #999;
}

.select-btn {
	padding: 8px 16px;
	font-size: 13px;
	color: #fff;
	cursor: pointer;
	background: var(--color-primary, #222);
	border: none;
	border-radius: 4px;
}

dialog {
	width: min(800px, 90vw);
	max-height: 80vh;
	padding: 24px;
	overflow-y: auto;
	border: none;
	border-radius: 8px;
}

dialog::backdrop {
	background: rgb(0 0 0 / 50%);
}

header {
	display: flex;
	gap: 16px;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 16px;
}

header h2 {
	margin: 0;
	font-size: 16px;
}

.upload-link {
	margin-left: auto;
	font-size: 13px;
	color: var(--color-primary, #222);
}
</style>
