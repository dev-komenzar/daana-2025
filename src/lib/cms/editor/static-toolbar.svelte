<script lang="ts">
import type { Editor } from '@tiptap/core'

type Properties = {
	editor: Editor
	onInsertImage?: () => void
	onSave?: (html: string) => void
}

let { editor, onInsertImage, onSave }: Properties = $props()

type Action = { aria: string; label: string; run: () => void }

const actions: Action[] = [
	{ aria: 'Image', label: '画像', run: () => onInsertImage?.() },
	{
		aria: 'Table',
		label: '表',
		run: () => editor.chain().focus().insertTable({ cols: 3, rows: 3, withHeaderRow: true }).run(),
	},
	{ aria: 'Undo', label: '元に戻す', run: () => editor.chain().focus().undo().run() },
	{ aria: 'Redo', label: 'やり直す', run: () => editor.chain().focus().redo().run() },
	{ aria: 'Save', label: '保存', run: () => onSave?.(editor.getHTML()) },
]
</script>

<div
	role="toolbar"
	aria-label="Editor toolbar"
	class="static-toolbar"
>
	{#each actions as action (action.aria)}
		<button
			type="button"
			aria-label={action.aria}
			onclick={action.run}>{action.label}</button
		>
	{/each}
</div>

<style>
.static-toolbar {
	display: flex;
	gap: 4px;
	padding: 8px;
	background: #f7f7f7;
	border: 1px solid #ccc;
	border-radius: 4px;
}

button {
	padding: 6px 10px;
	cursor: pointer;
	background: #fff;
	border: 1px solid #ccc;
	border-radius: 4px;
}

button:hover {
	background: #eee;
}
</style>
