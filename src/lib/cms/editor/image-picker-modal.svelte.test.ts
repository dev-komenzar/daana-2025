import { fireEvent, render } from '@testing-library/svelte'
import { Editor } from '@tiptap/core'
import { Image } from '@tiptap/extension-image'
import { StarterKit } from '@tiptap/starter-kit'
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest'

import type { MediaItem } from './image-picker-modal.svelte'

import ImagePickerModal from './image-picker-modal.svelte'

beforeAll(() => {
	HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
		this.setAttribute('open', '')
	})
	HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
		this.removeAttribute('open')
	})
	Object.defineProperty(HTMLDialogElement.prototype, 'open', {
		configurable: true,
		get(this: HTMLDialogElement) {
			return this.hasAttribute('open')
		},
	})
})

function createEditor() {
	return new Editor({
		content: '<p>hello</p>',
		element: document.createElement('div'),
		extensions: [StarterKit, Image],
	})
}

const mediaItems: MediaItem[] = [
	{ alt: 'First image', id: 'item1', src: 'https://example.com/img1.jpg', thumbUrl: 'https://example.com/thumb1.jpg' },
	{ alt: 'Second image', id: 'item2', src: 'https://example.com/img2.jpg', thumbUrl: 'https://example.com/thumb2.jpg' },
]

describe('ImagePickerModal', () => {
	let editor: Editor

	afterEach(() => {
		editor.destroy()
	})

	test('modal-dom: dialog 要素が DOM に存在する', () => {
		editor = createEditor()
		const { container } = render(ImagePickerModal, {
			editor,
			mediaItems,
			onClose: vi.fn(),
			open: false,
		})

		expect(container.querySelector('dialog')).toBeTruthy()
	})

	test('modal-open: open=true のとき dialog に open 属性がある', async () => {
		editor = createEditor()
		const { container } = render(ImagePickerModal, {
			editor,
			mediaItems,
			onClose: vi.fn(),
			open: true,
		})

		await vi.waitFor(() => {
			const dialog = container.querySelector('dialog')
			expect(dialog?.hasAttribute('open')).toBe(true)
		})
	})

	test('grid-buttons: mediaItems の数だけグリッドボタンが描画される', () => {
		editor = createEditor()
		const { container } = render(ImagePickerModal, {
			editor,
			mediaItems,
			onClose: vi.fn(),
			open: true,
		})

		const buttons = container.querySelectorAll('.media-grid button')
		expect(buttons).toHaveLength(mediaItems.length)
	})

	test('select-inserts-image: メディアアイテムをクリックすると editor に img が挿入される', async () => {
		editor = createEditor()
		const onClose = vi.fn()
		const { container } = render(ImagePickerModal, {
			editor,
			mediaItems,
			onClose,
			open: true,
		})

		const firstButton = container.querySelector('.media-grid button') as HTMLButtonElement
		fireEvent.click(firstButton)

		await vi.waitFor(() => {
			expect(editor.getHTML()).toContain('<img')
			expect(editor.getHTML()).toContain('src="https://example.com/img1.jpg"')
			expect(editor.getHTML()).toContain('alt="First image"')
		})
	})

	test('select-calls-onClose: メディアアイテムをクリックすると onClose が呼ばれる', async () => {
		editor = createEditor()
		const onClose = vi.fn()
		const { container } = render(ImagePickerModal, {
			editor,
			mediaItems,
			onClose,
			open: true,
		})

		const firstButton = container.querySelector('.media-grid button') as HTMLButtonElement
		fireEvent.click(firstButton)

		await vi.waitFor(() => {
			expect(onClose).toHaveBeenCalledOnce()
		})
	})

	test('close-button-calls-onClose: × ボタンをクリックすると onClose が呼ばれる', async () => {
		editor = createEditor()
		const onClose = vi.fn()
		const { getByRole } = render(ImagePickerModal, {
			editor,
			mediaItems,
			onClose,
			open: true,
		})

		fireEvent.click(getByRole('button', { name: '閉じる' }))

		await vi.waitFor(() => {
			expect(onClose).toHaveBeenCalledOnce()
		})
	})
})
