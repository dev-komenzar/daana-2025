<script lang="ts">
import { Editor } from '@tiptap/core'
import { StarterKit } from '@tiptap/starter-kit'
import { onDestroy, onMount } from 'svelte'

type Properties = {
	content?: string
	onUpdate?: (html: string) => void
}

let { content = '', onUpdate }: Properties = $props()

let editorElement: HTMLDivElement | undefined = $state()
let editor: Editor | undefined

onMount(() => {
	if (!editorElement) return
	editor = new Editor({
		content,
		element: editorElement,
		extensions: [StarterKit],
		onUpdate: ({ editor: instance }) => onUpdate?.(instance.getHTML()),
	})
})

onDestroy(() => {
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
