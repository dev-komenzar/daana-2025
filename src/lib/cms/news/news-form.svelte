<script lang="ts">
import type { Editor } from '@tiptap/core'

import BubbleMenu from '$lib/cms/editor/bubble-menu.svelte'
import ImagePickerModal, { type MediaItem } from '$lib/cms/editor/image-picker-modal.svelte'
import SlashMenu from '$lib/cms/editor/slash-menu.svelte'
import StaticToolbar from '$lib/cms/editor/static-toolbar.svelte'
import TipTapEditor from '$lib/cms/editor/tiptap-editor.svelte'
import { onDestroy, onMount } from 'svelte'

type Draft = { content: string; savedAt: string; title: string }

type Initial = {
	content?: string
	draft?: boolean
	pinned?: boolean
	published_at?: string
	thumbnail?: string
	title?: string
}

type Properties = {
	draftKey?: string
	error?: string
	initial?: Initial
	mediaItems: MediaItem[]
	submitLabel: string
}

let { draftKey, error: errorMessage, initial = {}, mediaItems, submitLabel }: Properties = $props()

let editor = $state<Editor | undefined>()
let formElement: HTMLFormElement | undefined = $state()
let contentInput: HTMLInputElement | undefined = $state()
let modalOpen = $state(false)
let savedDraft = $state<Draft | undefined>()
let debounceTimer: ReturnType<typeof setTimeout> | undefined

onMount(() => {
	if (!draftKey) return
	const raw = localStorage.getItem(draftKey)
	if (!raw) return
	try {
		const parsed = JSON.parse(raw) as Draft
		if (parsed.savedAt) savedDraft = parsed
	} catch {
		// ignore corrupted data
	}
})

onDestroy(() => {
	clearTimeout(debounceTimer)
})

function saveDraft() {
	if (!draftKey) return
	const titleInput = formElement?.querySelector<HTMLInputElement>('input[name="title"]')
	const draft: Draft = {
		content: editor?.getHTML() ?? '',
		savedAt: new Date().toISOString(),
		title: titleInput?.value ?? '',
	}
	localStorage.setItem(draftKey, JSON.stringify(draft))
}

function clearDraft() {
	if (draftKey) localStorage.removeItem(draftKey)
}

function handleEditorUpdate() {
	if (!draftKey) return
	clearTimeout(debounceTimer)
	debounceTimer = setTimeout(saveDraft, 5000)
}

function handleRestoreDraft() {
	if (!savedDraft || !editor) return
	const titleInput = formElement?.querySelector<HTMLInputElement>('input[name="title"]')
	if (titleInput && savedDraft.title) titleInput.value = savedDraft.title
	editor.commands.setContent(savedDraft.content)
	savedDraft = undefined
}

function handleDiscardDraft() {
	clearDraft()
	savedDraft = undefined
}

function handleSubmit() {
	if (!editor || !contentInput) return
	contentInput.value = editor.getHTML()
	clearDraft()
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

{#if savedDraft}
	<div
		class="draft-banner"
		role="status"
	>
		<span>未保存の下書きがあります（{savedDraft.savedAt.slice(0, 16).replace('T', ' ')}）</span>
		<button
			type="button"
			class="draft-btn draft-btn--restore"
			onclick={handleRestoreDraft}>復元</button
		>
		<button
			type="button"
			class="draft-btn draft-btn--discard"
			onclick={handleDiscardDraft}>破棄</button
		>
	</div>
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
		<SlashMenu {editor} />
	{/if}
	<TipTapEditor
		bind:editor
		content={initial.content ?? ''}
		onUpdate={handleEditorUpdate}
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

.draft-banner {
	display: flex;
	gap: 8px;
	align-items: center;
	max-width: 800px;
	padding: 8px 12px;
	color: #5a4000;
	background: #fff8d6;
	border: 1px solid #e8c840;
	border-radius: 4px;
}

.draft-banner span {
	flex: 1;
	font-size: 13px;
}

.draft-btn {
	padding: 4px 10px;
	font-size: 12px;
	cursor: pointer;
	border: 1px solid currentcolor;
	border-radius: 3px;
}

.draft-btn--restore {
	color: #444;
	background: #fff;
}

.draft-btn--discard {
	color: #999;
	background: transparent;
}
</style>
