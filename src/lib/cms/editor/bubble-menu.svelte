<script lang="ts">
import type { Editor } from '@tiptap/core'

import { onDestroy, onMount } from 'svelte'

type ToggleMark = 'bold' | 'italic' | 'strike' | 'underline'

type Properties = { editor: Editor }

let { editor }: Properties = $props()

let linkHref = $state('')
let showLinkForm = $state(false)
let visible = $state(false)
let popTop = $state(0)
let popLeft = $state(0)
let bubbleElement: HTMLDivElement | undefined = $state()

const toggles: { label: string; mark: ToggleMark }[] = [
	{ label: 'Bold', mark: 'bold' },
	{ label: 'Italic', mark: 'italic' },
	{ label: 'Underline', mark: 'underline' },
	{ label: 'Strike', mark: 'strike' },
]

function isImageNodeSelection(): boolean {
	return editor.isActive('image') || editor.isActive('figure')
}

function getLinkHrefValue(): string {
	return editor.getAttributes('link').href ?? editor.getAttributes('figure').linkHref ?? ''
}

function refreshVisibility() {
	const sel = editor.state.selection
	const isLinkActive = editor.isActive('link')
	const isImage = isImageNodeSelection()

	visible = !sel.empty || isLinkActive || isImage

	// Auto-show link form only when cursor rests on a link (empty selection)
	if (isLinkActive && sel.empty) {
		linkHref = getLinkHrefValue()
		showLinkForm = true
	}

	refreshPosition()
}

function refreshPosition() {
	if (!visible) return

	const sel = editor.state.selection
	const isImage = isImageNodeSelection()
	let rect: { bottom: number; left: number; right: number; top: number }

	if (sel.empty || isImage) {
		const coords = editor.view.coordsAtPos(sel.from)
		rect = { bottom: coords.bottom, left: coords.left, right: coords.right, top: coords.top }
	} else {
		const domSel = document.getSelection()
		if (!domSel || domSel.rangeCount === 0) return
		rect = domSel.getRangeAt(0).getBoundingClientRect()
	}

	const popoverWidth = 400
	const centerX = rect.left + (rect.right - rect.left) / 2 - popoverWidth / 2
	popTop = rect.bottom + 8
	popLeft = Math.max(8, Math.min(window.innerWidth - popoverWidth - 8, centerX))
}

function handleDocumentClick(event: MouseEvent) {
	if (showLinkForm) return
	if (bubbleElement && bubbleElement.contains(event.target as Node)) return
	// 選択中(テキスト選択や画像NodeSelection)は閉じない
	if (!editor.state.selection.empty) return
	// カーソルがリンク上にある場合も維持
	if (editor.isActive('link')) return
	visible = false
	showLinkForm = false
}

onMount(() => {
	editor.on('selectionUpdate', refreshVisibility)
	editor.on('transaction', refreshVisibility)
	window.addEventListener('scroll', refreshPosition, { passive: true })
	window.addEventListener('resize', refreshPosition, { passive: true })
	document.addEventListener('click', handleDocumentClick)
	refreshVisibility()
})

onDestroy(() => {
	editor.off('selectionUpdate', refreshVisibility)
	editor.off('transaction', refreshVisibility)
	window.removeEventListener('scroll', refreshPosition)
	window.removeEventListener('resize', refreshPosition)
	document.removeEventListener('click', handleDocumentClick)
})

function toggle(mark: ToggleMark) {
	editor.chain().focus().toggleMark(mark).run()
}

function applyColor(event: Event) {
	const value = (event.currentTarget as HTMLInputElement).value
	editor.chain().focus().setColor(value).run()
}

function openLink() {
	linkHref = getLinkHrefValue()
	showLinkForm = true
}

function applyLink() {
	if (!linkHref) return

	if (editor.isActive('figure')) {
		editor.chain().focus().updateAttributes('figure', { linkHref }).run()
	} else {
		editor.chain().focus().extendMarkRange('link').setLink({ href: linkHref }).run()
	}
	showLinkForm = false
}

function deleteLink() {
	if (editor.isActive('figure')) {
		editor.chain().focus().updateAttributes('figure', { linkHref: undefined }).run()
	} else {
		editor.chain().focus().extendMarkRange('link').unsetLink().run()
	}
	showLinkForm = false
}

function cancelLink() {
	showLinkForm = false
}
</script>

{#if visible}
	<div
		bind:this={bubbleElement}
		class="bubble-popover"
		style="top: {popTop}px; left: {popLeft}px"
		role="toolbar"
		aria-label="Text formatting"
	>
		<div class="bubble-row">
			{#each toggles as { label, mark } (mark)}
				<button
					type="button"
					aria-label={label}
					onclick={() => toggle(mark)}>{label[0]}</button
				>
			{/each}
			<input
				type="color"
				aria-label="Color"
				oninput={applyColor}
			/>
		</div>
		<div class="bubble-row">
			{#if !showLinkForm}
				<button
					type="button"
					aria-label="Link"
					onclick={openLink}>Link</button
				>
			{/if}
			{#if showLinkForm}
				<form
					onsubmit={event => {
						event.preventDefault()
						applyLink()
					}}
				>
					<input
						type="url"
						aria-label="Link URL"
						bind:value={linkHref}
					/>
					<button type="submit">保存</button>
					<button
						type="button"
						onclick={deleteLink}>削除</button
					>
					<button
						type="button"
						onclick={cancelLink}>キャンセル</button
					>
				</form>
			{/if}
		</div>
	</div>
{/if}

<style>
.bubble-popover {
	position: fixed;
	z-index: 1000;
	display: flex;
	flex-direction: column;
	gap: 4px;
	padding: 4px;
	background: #fff;
	border: 1px solid #ccc;
	border-radius: 4px;
	box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
}

.bubble-row {
	display: flex;
	gap: 4px;
}

button {
	padding: 4px 8px;
	cursor: pointer;
}
</style>
