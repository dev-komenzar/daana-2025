<script lang="ts">
import { MetaTags } from 'svelte-meta-tags'

import type { ActionData } from './$types'

let { form }: { form?: ActionData } = $props()

let dragOver = $state(false)
let fileInput: HTMLInputElement | undefined = $state()

function onDrop(event: DragEvent) {
	event.preventDefault()
	dragOver = false
	if (!fileInput) return
	const files = event.dataTransfer?.files
	if (files && files.length > 0) fileInput.files = files
}

function onDragLeave() {
	dragOver = false
}

function onDragOver(event: DragEvent) {
	event.preventDefault()
	dragOver = true
}
</script>

<MetaTags title="メディアアップロード" />

<h1>アップロード</h1>

{#if form?.error}
	<p
		class="error"
		role="alert"
	>
		{form.error}
	</p>
{/if}

<form
	method="POST"
	enctype="multipart/form-data"
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
		画像をドラッグ&amp;ドロップ or クリック
		<input
			bind:this={fileInput}
			type="file"
			name="file"
			accept="image/*"
			required
		/>
	</div>
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
	padding: 40px;
	text-align: center;
	background: #fafafa;
	border: 2px dashed #ccc;
	border-radius: 8px;
}

.dropzone.is-active {
	background: #eef;
	border-color: #08192d;
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

button {
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
