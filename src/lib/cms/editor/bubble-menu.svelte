<script lang="ts">
import type { Editor } from '@tiptap/core'

import { onDestroy, onMount } from 'svelte'

type ToggleMark = 'bold' | 'italic' | 'strike' | 'underline'

type Properties = { editor: Editor }

let { editor }: Properties = $props()

let linkHref = $state('')
let linkOpen = $state(false)
let visible = $state(false)

const toggles: { label: string; mark: ToggleMark }[] = [
	{ label: 'Bold', mark: 'bold' },
	{ label: 'Italic', mark: 'italic' },
	{ label: 'Underline', mark: 'underline' },
	{ label: 'Strike', mark: 'strike' },
]

function refreshVisibility() {
	visible = !editor.state.selection.empty
}

onMount(() => {
	editor.on('selectionUpdate', refreshVisibility)
	editor.on('transaction', refreshVisibility)
	refreshVisibility()
})

onDestroy(() => {
	editor.off('selectionUpdate', refreshVisibility)
	editor.off('transaction', refreshVisibility)
})

function toggle(mark: ToggleMark) {
	editor.chain().focus().toggleMark(mark).run()
}

function applyColor(event: Event) {
	const value = (event.currentTarget as HTMLInputElement).value
	editor.chain().focus().setColor(value).run()
}

function openLink() {
	linkHref = editor.getAttributes('link').href ?? ''
	linkOpen = true
}

function applyLink() {
	if (linkHref) {
		editor.chain().focus().extendMarkRange('link').setLink({ href: linkHref }).run()
	} else {
		editor.chain().focus().extendMarkRange('link').unsetLink().run()
	}
	linkOpen = false
}
</script>

<div
	class="bubble-menu"
	class:is-visible={visible}
	role="toolbar"
	aria-label="Text formatting"
>
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
	<button
		type="button"
		aria-label="Link"
		onclick={openLink}>Link</button
	>
	{#if linkOpen}
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
			<button type="submit">Apply</button>
		</form>
	{/if}
</div>

<style>
.bubble-menu {
	display: none;
	gap: 4px;
	padding: 4px;
	background: #fff;
	border: 1px solid #ccc;
	border-radius: 4px;
	box-shadow: 0 2px 8px rgb(0 0 0 / 15%);
}

.bubble-menu.is-visible {
	display: inline-flex;
}

button {
	padding: 4px 8px;
	cursor: pointer;
}
</style>
