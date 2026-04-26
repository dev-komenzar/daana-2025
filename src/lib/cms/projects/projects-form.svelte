<script lang="ts">
import type { Editor } from '@tiptap/core'

import BubbleMenu from '$lib/cms/editor/bubble-menu.svelte'
import ImagePickerModal, { type MediaItem } from '$lib/cms/editor/image-picker-modal.svelte'
import SlashMenu from '$lib/cms/editor/slash-menu.svelte'
import StaticToolbar from '$lib/cms/editor/static-toolbar.svelte'
import TipTapEditor from '$lib/cms/editor/tiptap-editor.svelte'

type Initial = {
	body?: string
	draft?: boolean
	original_id?: string
	projectLink?: string
	published_at?: string
	title?: string
	type?: string[]
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
let bodyInput: HTMLInputElement | undefined = $state()
let modalOpen = $state(false)

function handleSubmit() {
	if (!editor || !bodyInput) return
	bodyInput.value = editor.getHTML()
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
	class="projects-form"
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
		プロジェクトリンク
		<input
			type="url"
			name="projectLink"
			value={initial.projectLink ?? ''}
			aria-label="プロジェクトリンク"
		/>
	</label>
	<fieldset>
		<legend>タイプ</legend>
		<label class="checkbox-label">
			<input
				type="checkbox"
				name="type"
				value="mono"
				checked={initial.type?.includes('mono') ?? false}
				aria-label="mono"
			/>
			mono
		</label>
		<label class="checkbox-label">
			<input
				type="checkbox"
				name="type"
				value="hito"
				checked={initial.type?.includes('hito') ?? false}
				aria-label="hito"
			/>
			hito
		</label>
	</fieldset>
	<label>
		公開日時
		<input
			type="datetime-local"
			name="published_at"
			value={toLocalDateTime(initial.published_at)}
			aria-label="公開日時"
		/>
	</label>
	<label class="checkbox-label">
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
		<SlashMenu {editor} />
	{/if}
	<TipTapEditor
		bind:editor
		content={initial.body ?? ''}
	/>

	<input
		type="hidden"
		name="body"
		bind:this={bodyInput}
		value={initial.body ?? ''}
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
.projects-form {
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

.checkbox-label {
	flex-direction: row;
	gap: 8px;
	align-items: center;
}

fieldset {
	display: flex;
	flex-direction: column;
	gap: 6px;
	padding: 8px 12px;
	border: 1px solid #ccc;
	border-radius: 4px;
}

legend {
	font-size: 14px;
}

input[type='text'],
input[type='url'],
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
