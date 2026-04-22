<script lang="ts">
import type { Editor } from '@tiptap/core'

import BubbleMenu from '$lib/cms/editor/bubble-menu.svelte'
import ImagePickerModal, { type MediaItem } from '$lib/cms/editor/image-picker-modal.svelte'
import StaticToolbar from '$lib/cms/editor/static-toolbar.svelte'
import TipTapEditor from '$lib/cms/editor/tiptap-editor.svelte'

type Initial = {
	content?: string
	draft?: boolean
	pinned?: boolean
	published_at?: string
	thumbnail?: string
	title?: string
}

type Properties = {
	error?: string
	initial?: Initial
	mediaItems: MediaItem[]
	submitLabel: string
}

let { error: errorMessage, initial = {}, mediaItems, submitLabel }: Properties = $props()

let editor = $state<Editor | undefined>()
let formElement: HTMLFormElement | undefined = $state()
let contentInput: HTMLInputElement | undefined = $state()
let modalOpen = $state(false)

function handleSubmit() {
	if (!editor || !contentInput) return
	contentInput.value = editor.getHTML()
}

function handleSave() {
	formElement?.requestSubmit()
}

function handleInsertImage() {
	modalOpen = true
}

function handleCloseModal() {
	modalOpen = false
}

function padTwo(n: number): string {
	return String(n).padStart(2, '0')
}

function toLocalDateTime(iso?: string): string {
	if (!iso) return ''
	const d = new Date(iso)
	if (Number.isNaN(d.getTime())) return ''
	return `${d.getFullYear()}-${padTwo(d.getMonth() + 1)}-${padTwo(d.getDate())}T${padTwo(d.getHours())}:${padTwo(d.getMinutes())}`
}
</script>

{#if errorMessage}
	<p
		class="error"
		role="alert"
	>
		{errorMessage}
	</p>
{/if}

<form
	bind:this={formElement}
	method="POST"
	onsubmit={handleSubmit}
	class="news-form"
>
	<label>
		タイトル
		<input
			type="text"
			name="title"
			value={initial.title ?? ''}
			required
			aria-label="タイトル"
		/>
	</label>
	<label>
		サムネイル (media record ID)
		<input
			type="text"
			name="thumbnail"
			value={initial.thumbnail ?? ''}
			aria-label="サムネイル (media record ID)"
		/>
	</label>
	<label>
		公開日時
		<input
			type="datetime-local"
			name="published_at"
			value={toLocalDateTime(initial.published_at)}
			aria-label="公開日時"
		/>
	</label>
	<label>
		<input
			type="checkbox"
			name="pinned"
			checked={initial.pinned ?? false}
			aria-label="固定"
		/>
		固定
	</label>
	<label>
		<input
			type="checkbox"
			name="draft"
			checked={initial.draft ?? false}
			aria-label="下書き"
		/>
		下書き
	</label>

	{#if editor}
		<StaticToolbar
			{editor}
			onInsertImage={handleInsertImage}
			onSave={handleSave}
		/>
		<BubbleMenu {editor} />
	{/if}
	<TipTapEditor
		bind:editor
		content={initial.content ?? ''}
	/>

	<input
		type="hidden"
		name="content"
		bind:this={contentInput}
		value={initial.content ?? ''}
	/>

	<button type="submit">{submitLabel}</button>
</form>

{#if editor}
	<ImagePickerModal
		{editor}
		{mediaItems}
		open={modalOpen}
		onClose={handleCloseModal}
	/>
{/if}

<style>
.news-form {
	display: flex;
	flex-direction: column;
	gap: 12px;
	max-width: 800px;
}

label {
	display: flex;
	flex-direction: column;
	gap: 4px;
	font-size: 14px;
}

input[type='text'],
input[type='datetime-local'] {
	padding: 8px 10px;
	border: 1px solid #ccc;
	border-radius: 4px;
}

button[type='submit'] {
	align-self: flex-start;
	padding: 10px 20px;
	color: #fff;
	cursor: pointer;
	background: var(--color-primary, #222);
	border: none;
	border-radius: 4px;
}

.error {
	padding: 8px 10px;
	color: #7a0000;
	background: #fdd;
	border-radius: 4px;
}
</style>
