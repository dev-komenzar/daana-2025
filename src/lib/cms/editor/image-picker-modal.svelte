<script lang="ts">
import type { Editor } from '@tiptap/core'

import MediaGrid, { type MediaItem } from '$lib/cms/media-grid.svelte'
import { untrack } from 'svelte'

type Properties = {
	editor: Editor
	mediaItems: MediaItem[]
	onClose: () => void
	open: boolean
}

let { editor, mediaItems, onClose, open }: Properties = $props()

let dialog = $state<HTMLDialogElement | undefined>()
let allItems = $state(untrack(() => mediaItems))
let currentPage = $state(1)
let hasMore = $state(untrack(() => mediaItems.length >= 30))

$effect(() => {
	if (!dialog) return
	if (open && !dialog.open) dialog.showModal()
	if (!open && dialog.open) dialog.close()
})

async function loadMore() {
	if (!hasMore) return
	const nextPage = currentPage + 1
	const response = await fetch(`/api/cms/media?page=${nextPage}`)
	if (!response.ok) {
		hasMore = false
		return
	}
	const data = (await response.json()) as { items: MediaItem[]; page: number; totalPages: number }
	allItems = [...allItems, ...data.items]
	currentPage = data.page
	hasMore = currentPage < data.totalPages
}

function selectItem(item: MediaItem) {
	editor
		.chain()
		.focus()
		.setImage({ alt: item.alt, src: `pb-media://${item.id}` })
		.run()
	onClose()
}

function handleDialogClick(event: MouseEvent) {
	if (event.target === dialog) onClose()
}
</script>

<dialog
	bind:this={dialog}
	aria-label="画像を選択"
	onclick={handleDialogClick}
	onclose={onClose}
>
	<header>
		<h2>画像を選択</h2>
		<button
			type="button"
			aria-label="閉じる"
			onclick={onClose}>×</button
		>
	</header>
	<MediaGrid
		items={allItems}
		onselect={selectItem}
		onloadmore={loadMore}
	/>
</dialog>

<style>
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
</style>
