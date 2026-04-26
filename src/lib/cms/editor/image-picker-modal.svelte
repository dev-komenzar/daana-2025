<script lang="ts">
import type { Editor } from '@tiptap/core'

export type MediaItem = { alt: string; id: string; src: string; thumbUrl: string }

type Properties = {
	editor: Editor
	mediaItems: MediaItem[]
	onClose: () => void
	open: boolean
}

let { editor, mediaItems, onClose, open }: Properties = $props()

let dialog: HTMLDialogElement | undefined = $state()

$effect(() => {
	if (!dialog) return
	if (open && !dialog.open) dialog.showModal()
	if (!open && dialog.open) dialog.close()
})

function selectItem(item: MediaItem) {
	editor.chain().focus().setImage({ alt: item.alt, src: item.src }).run()
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
	<ul class="media-grid">
		{#each mediaItems as item (item.id)}
			<li>
				<button
					type="button"
					onclick={() => selectItem(item)}
				>
					<img
						src={item.thumbUrl}
						alt={item.alt}
					/>
					<span class="alt">{item.alt}</span>
				</button>
			</li>
		{/each}
	</ul>
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

.media-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
	gap: 8px;
	padding: 0;
	list-style: none;
}

.media-grid li {
	margin: 0;
}

.media-grid button {
	display: flex;
	flex-direction: column;
	gap: 4px;
	width: 100%;
	padding: 4px;
	cursor: pointer;
	background: transparent;
	border: 1px solid transparent;
	border-radius: 4px;
}

.media-grid button:hover {
	border-color: var(--color-primary, #08192d);
}

.media-grid img {
	width: 100%;
	height: auto;
	aspect-ratio: 1;
	object-fit: cover;
}

.alt {
	overflow: hidden;
	text-overflow: ellipsis;
	font-size: 11px;
	white-space: nowrap;
}
</style>
