<script lang="ts">
import { enhance } from '$app/forms'
import { MetaTags } from 'svelte-meta-tags'

import type { ActionData } from './$types'

let { form }: { form?: ActionData } = $props()

let dragOver = $state(false)
let fileInput: HTMLInputElement | undefined = $state()
let selectedFile = $state<File | undefined>()
let previewUrl = $state<string | undefined>()
let clientError = $state<string | undefined>()

$effect(() => {
	if (!selectedFile) {
		previewUrl = undefined
		return
	}
	const url = URL.createObjectURL(selectedFile)
	previewUrl = url
	return () => URL.revokeObjectURL(url)
})

function handleFiles(files: FileList | null | undefined) {
	if (!files || files.length === 0) return
	const file = files[0]
	if (!file.type.startsWith('image/')) {
		clientError = '画像ファイルを選択してください'
		return
	}
	clientError = undefined
	selectedFile = file
}

function clearSelection() {
	selectedFile = undefined
	clientError = undefined
	if (fileInput) fileInput.value = ''
}

function onDrop(event: DragEvent) {
	event.preventDefault()
	dragOver = false
	handleFiles(event.dataTransfer?.files)
}

function onDragLeave() {
	dragOver = false
}

function onDragOver(event: DragEvent) {
	event.preventDefault()
	dragOver = true
}

function onChange(event: Event) {
	const target = event.currentTarget as HTMLInputElement
	handleFiles(target.files)
}

function onClearClick(event: MouseEvent) {
	event.stopPropagation()
	clearSelection()
}
</script>

<MetaTags title="メディアアップロード" />

<h1>アップロード</h1>

{#if clientError || form?.error}
	<p
		class="error"
		role="alert"
	>
		{clientError ?? form?.error}
	</p>
{/if}

<form
	method="POST"
	enctype="multipart/form-data"
	use:enhance={({ cancel, formData }) => {
		if (!selectedFile) {
			clientError = 'ファイルを選択してください'
			cancel()
			return
		}
		formData.set('file', selectedFile)
	}}
>
	<div
		role="region"
		aria-label="dropzone"
		class="dropzone"
		class:is-active={dragOver}
		ondrop={onDrop}
		ondragover={onDragOver}
		ondragleave={onDragLeave}
	>
		<input
			bind:this={fileInput}
			onchange={onChange}
			type="file"
			name="file"
			accept="image/*"
			class="file-input"
		/>
		{#if previewUrl}
			<img
				src={previewUrl}
				alt="選択中の画像プレビュー"
				class="preview-img"
			/>
			<button
				type="button"
				class="clear-btn"
				aria-label="選択した画像を取り消す"
				onclick={onClearClick}>×</button
			>
		{:else}
			<span class="hint">画像をドラッグ&amp;ドロップ or クリック</span>
		{/if}
	</div>
	{#if selectedFile}
		<p
			class="filename"
			data-testid="preview-filename"
		>
			{selectedFile.name}
		</p>
	{/if}
	<label>
		代替テキスト (alt)
		<input
			type="text"
			name="alt"
			required
		/>
	</label>
	<label>
		キャプション (任意)
		<input
			type="text"
			name="caption"
		/>
	</label>
	<button type="submit">アップロード</button>
</form>

<style>
.dropzone {
	position: relative;
	height: 240px;
	text-align: center;
	background: #fafafa;
	border: 2px dashed #ccc;
	border-radius: 8px;
}

.dropzone.is-active {
	background: #eef;
	border-color: #08192d;
}

.file-input {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
	cursor: pointer;
	opacity: 0;
}

.hint {
	position: absolute;
	inset: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	pointer-events: none;
}

.preview-img {
	position: absolute;
	inset: 8px;
	width: calc(100% - 16px);
	height: calc(100% - 16px);
	pointer-events: none;
	object-fit: contain;
}

.clear-btn {
	position: absolute;
	top: 8px;
	right: 8px;
	z-index: 2;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 28px;
	height: 28px;
	padding: 0;
	font-size: 18px;
	line-height: 1;
	color: #fff;
	cursor: pointer;
	background: rgb(0 0 0 / 60%);
	border: none;
	border-radius: 50%;
}

.clear-btn:hover {
	background: rgb(0 0 0 / 80%);
}

.filename {
	margin-top: 8px;
	font-size: 13px;
	color: #666;
	overflow-wrap: anywhere;
}

label {
	display: flex;
	flex-direction: column;
	gap: 4px;
	margin-top: 12px;
}

input[type='text'] {
	padding: 8px 10px;
	border: 1px solid #ccc;
	border-radius: 4px;
}

button[type='submit'] {
	padding: 10px 16px;
	margin-top: 16px;
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
