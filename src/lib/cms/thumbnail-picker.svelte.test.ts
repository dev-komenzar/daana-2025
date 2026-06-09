import { fireEvent, render } from '@testing-library/svelte'
import { beforeAll, describe, expect, test, vi } from 'vitest'

import type { MediaItem } from './media-grid.svelte'

import ThumbnailPicker from './thumbnail-picker.svelte'

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

	function MockIntersectionObserver() {
		return { disconnect: vi.fn(), observe: vi.fn(), unobserve: vi.fn() }
	}
	vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)

	vi.stubGlobal('fetch', vi.fn())
})

const mediaItems: MediaItem[] = [
	{ alt: 'First image', id: 'item1', thumbUrl: 'https://example.com/thumb1.jpg' },
	{ alt: 'Second image', id: 'item2', thumbUrl: 'https://example.com/thumb2.jpg' },
]

describe('ThumbnailPicker', () => {
	test('renders hidden input with correct name', () => {
		const { container } = render(ThumbnailPicker, {
			mediaItems,
			name: 'thumbnail',
		})

		const input = container.querySelector('input[type="hidden"]')
		expect(input).toBeTruthy()
		expect((input as HTMLInputElement).name).toBe('thumbnail')
	})

	test('renders placeholder when no initialId', () => {
		const { container } = render(ThumbnailPicker, {
			mediaItems,
			name: 'thumbnail',
		})

		expect(container.querySelector('.placeholder')).toBeTruthy()
		expect(container.querySelector('.preview-img')).toBeFalsy()
	})

	test('renders preview image when initialId matches an item', () => {
		const { container } = render(ThumbnailPicker, {
			initialId: 'item1',
			mediaItems,
			name: 'thumbnail',
		})

		const img = container.querySelector('.preview-img') as HTMLImageElement
		expect(img).toBeTruthy()
		expect(img.src).toBe('https://example.com/thumb1.jpg')
		expect(container.querySelector('.placeholder')).toBeFalsy()
	})

	test('renders preview image from initialThumbUrl when initialId not in items', () => {
		const { container } = render(ThumbnailPicker, {
			initialId: 'old-item',
			initialThumbUrl: 'https://example.com/old-thumb.jpg',
			mediaItems,
			name: 'thumbnail',
		})

		const img = container.querySelector('.preview-img') as HTMLImageElement
		expect(img).toBeTruthy()
		expect(img.src).toBe('https://example.com/old-thumb.jpg')
	})

	test('hidden input value matches initialId', () => {
		const { container } = render(ThumbnailPicker, {
			initialId: 'item2',
			mediaItems,
			name: 'thumbnail',
		})

		const input = container.querySelector('input[type="hidden"]') as HTMLInputElement
		expect(input.value).toBe('item2')
	})

	test('hidden input value is empty when no initialId', () => {
		const { container } = render(ThumbnailPicker, {
			mediaItems,
			name: 'thumbnail',
		})

		const input = container.querySelector('input[type="hidden"]') as HTMLInputElement
		expect(input.value).toBe('')
	})

	test('clicking clear button removes selection', async () => {
		const { container } = render(ThumbnailPicker, {
			initialId: 'item1',
			mediaItems,
			name: 'thumbnail',
		})

		const clearButton = container.querySelector('.clear-btn') as HTMLButtonElement
		expect(clearButton).toBeTruthy()

		fireEvent.click(clearButton)

		await vi.waitFor(() => {
			const input = container.querySelector('input[type="hidden"]') as HTMLInputElement
			expect(input.value).toBe('')
			expect(container.querySelector('.placeholder')).toBeTruthy()
		})
	})

	test('opening modal shows dialog with MediaGrid', async () => {
		const { container } = render(ThumbnailPicker, {
			mediaItems,
			name: 'thumbnail',
		})

		const selectButton = container.querySelector('.select-btn') as HTMLButtonElement
		fireEvent.click(selectButton)

		await vi.waitFor(() => {
			const dialog = container.querySelector('dialog')
			expect(dialog?.hasAttribute('open')).toBe(true)
			expect(container.querySelector('.media-grid')).toBeTruthy()
		})
	})

	test('selecting an item in grid updates hidden input and closes modal', async () => {
		const { container } = render(ThumbnailPicker, {
			mediaItems,
			name: 'thumbnail',
		})

		const selectButton = container.querySelector('.select-btn') as HTMLButtonElement
		fireEvent.click(selectButton)

		await vi.waitFor(() => {
			expect(container.querySelector('dialog')?.hasAttribute('open')).toBe(true)
		})

		const gridButton = container.querySelector('.media-grid button') as HTMLButtonElement
		fireEvent.click(gridButton)

		await vi.waitFor(() => {
			const input = container.querySelector('input[type="hidden"]') as HTMLInputElement
			expect(input.value).toBe('item1')
			expect(container.querySelector('dialog')?.hasAttribute('open')).toBe(false)
		})
	})

	test('modal contains upload link', () => {
		const { container } = render(ThumbnailPicker, {
			mediaItems,
			name: 'thumbnail',
		})

		expect(container.querySelector('.upload-link')).toBeTruthy()
	})
})
