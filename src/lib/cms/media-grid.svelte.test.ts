import { fireEvent, render } from '@testing-library/svelte'
import { beforeAll, describe, expect, test, vi } from 'vitest'

import type { MediaItem } from './media-grid.svelte'

import MediaGrid from './media-grid.svelte'

beforeAll(() => {
	function MockIntersectionObserver() {
		return { disconnect: vi.fn(), observe: vi.fn(), unobserve: vi.fn() }
	}
	vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
})

const items: MediaItem[] = [
	{ alt: 'First image', id: 'item1', thumbUrl: 'https://example.com/thumb1.jpg' },
	{ alt: 'Second image', id: 'item2', thumbUrl: 'https://example.com/thumb2.jpg' },
]

describe('MediaGrid', () => {
	test('renders all items as buttons', () => {
		const { container } = render(MediaGrid, { items, onselect: vi.fn() })

		const buttons = container.querySelectorAll('.media-grid button')
		expect(buttons).toHaveLength(items.length)
	})

	test('renders thumbnails with correct src and alt', () => {
		const { container } = render(MediaGrid, { items, onselect: vi.fn() })

		const images = container.querySelectorAll('.media-grid img')
		expect(images).toHaveLength(items.length)
		expect((images[0] as HTMLImageElement).src).toBe('https://example.com/thumb1.jpg')
		expect((images[0] as HTMLImageElement).alt).toBe('First image')
	})

	test('calls onselect with item when button clicked', () => {
		const onselect = vi.fn()
		const { container } = render(MediaGrid, { items, onselect })

		const firstButton = container.querySelector('.media-grid button') as HTMLButtonElement
		fireEvent.click(firstButton)

		expect(onselect).toHaveBeenCalledWith(items[0])
	})

	test('applies selected class to selected item', () => {
		const { container } = render(MediaGrid, { items, onselect: vi.fn(), selectedId: 'item1' })

		const buttons = container.querySelectorAll('.media-grid button')
		expect(buttons[0].classList.contains('selected')).toBe(true)
		expect(buttons[1].classList.contains('selected')).toBe(false)
	})

	test('renders sentinel element when onloadmore provided', () => {
		const { container } = render(MediaGrid, { items, onloadmore: vi.fn(), onselect: vi.fn() })

		expect(container.querySelector('.sentinel')).toBeTruthy()
	})

	test('does not render sentinel without onloadmore', () => {
		const { container } = render(MediaGrid, { items, onselect: vi.fn() })

		expect(container.querySelector('.sentinel')).toBeFalsy()
	})

	test('applies extra class via class prop', () => {
		const { container } = render(MediaGrid, { class: 'my-custom', items, onselect: vi.fn() })

		expect(container.querySelector('.media-grid.my-custom')).toBeTruthy()
	})
})
