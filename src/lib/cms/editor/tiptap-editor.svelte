<script lang="ts">
import { Editor } from '@tiptap/core'
import { Color } from '@tiptap/extension-color'
import { Image } from '@tiptap/extension-image'
import { Link } from '@tiptap/extension-link'
import { Table, TableCell, TableHeader, TableRow } from '@tiptap/extension-table'
import { TextStyle } from '@tiptap/extension-text-style'
import { StarterKit } from '@tiptap/starter-kit'
import { onDestroy, onMount } from 'svelte'

import { FigureExtension } from './figure-extension'
import { HeadingWithId } from './heading-with-id'

type Properties = {
	content?: string
	editor?: Editor
	onUpdate?: (html: string) => void
}

let { content = '', editor = $bindable(), onUpdate }: Properties = $props()

let editorElement: HTMLDivElement | undefined = $state()

function handleEditorClickCapture(event: MouseEvent) {
	const target = event.target
	if (target instanceof HTMLElement && target.closest('a')) {
		event.preventDefault()
	}
}

onMount(() => {
	if (!editorElement) return
	editorElement.addEventListener('click', handleEditorClickCapture, true)
	editor = new Editor({
		content,
		editorProps: {
			handleClick(_view, _pos, event) {
				const target = event.target
				if (target instanceof HTMLElement && target.closest('a')) {
					event.preventDefault()
				}
			},
		},
		element: editorElement,
		extensions: [StarterKit.configure({ heading: false, link: false }), HeadingWithId, TextStyle, Color, Link.configure({ autolink: false, openOnClick: false }), Image.configure({ inline: true }), Table.configure({ resizable: true }), TableCell, TableHeader, TableRow, FigureExtension],
		onUpdate: ({ editor: instance }) => onUpdate?.(instance.getHTML()),
	})
})

onDestroy(() => {
	editorElement?.removeEventListener('click', handleEditorClickCapture, true)
	editor?.destroy()
})
</script>

<div
	bind:this={editorElement}
	class="tiptap-editor-root"
></div>

<style>
.tiptap-editor-root {
	min-height: 200px;
	padding: 12px;
	border: 1px solid #ccc;
	border-radius: 4px;
}

/* stylelint-disable-next-line selector-class-pattern -- .ProseMirror is the fixed class name emitted by ProseMirror/TipTap. */
:global(.tiptap-editor-root .ProseMirror) {
	min-height: 180px;
	outline: none;
}
</style>
