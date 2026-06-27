import { render } from '@testing-library/svelte'
import { describe, expect, test, vi } from 'vitest'

import TipTapEditor from './tiptap-editor.svelte'

describe('TipTapEditor', () => {
	test('content を渡すと初期 HTML が ProseMirror 領域に描画される', async () => {
		const { container } = render(TipTapEditor, { content: '<p>初期本文</p>' })

		await vi.waitFor(() => {
			const pm = container.querySelector('.ProseMirror')
			expect(pm).not.toBeNull()
			expect(pm?.textContent).toContain('初期本文')
		})
	})

	test('content 未指定でも編集領域はレンダリングされる', async () => {
		const { container } = render(TipTapEditor)

		await vi.waitFor(() => {
			expect(container.querySelector('.ProseMirror')).not.toBeNull()
		})
	})

	test('linked-image-content: <a href><img> を parse すると link mark が保持される', async () => {
		const { container } = render(TipTapEditor, { content: '<p><a href="https://example.com"><img src="https://example.com/x.jpg" alt="x" /></a></p>' })

		await vi.waitFor(() => {
			const anchor = container.querySelector('.ProseMirror a[href="https://example.com"]')
			expect(anchor).not.toBeNull()
			const img = anchor?.querySelector('img')
			expect(img?.getAttribute('src')).toBe('https://example.com/x.jpg')
		})
	})

	test('onUpdate callback は prop として受け取れる (spec)', () => {
		const onUpdate = vi.fn<(html: string) => void>()
		const { container } = render(TipTapEditor, { content: '<p>hi</p>', onUpdate })
		expect(container.querySelector('.tiptap-editor-root')).not.toBeNull()
	})

	test('linked-figure-prevents-navigation: <figure><a><img> クリックで navigate 抑制される', async () => {
		const { container } = render(TipTapEditor, {
			content: '<figure><a href="https://example.com"><img src="https://example.com/x.jpg" alt="x" /></a></figure>',
		})

		await vi.waitFor(() => {
			const anchor = container.querySelector('.ProseMirror a')
			expect(anchor).not.toBeNull()
		})

		const pm = container.querySelector<HTMLElement>('.ProseMirror')!
		vi.spyOn(pm, 'getBoundingClientRect').mockReturnValue({
			bottom: 100,
			height: 100,
			left: 0,
			right: 800,
			toJSON: () => ({}),
			top: 0,
			width: 800,
			x: 0,
			y: 0,
		})
		Object.defineProperty(document, 'elementFromPoint', {
			configurable: true,
			value: () => pm,
			writable: true,
		})

		const anchor = container.querySelector<HTMLAnchorElement>('.ProseMirror a')!
		const mouseDownEvent = new MouseEvent('mousedown', {
			bubbles: true,
			cancelable: true,
			clientX: 10,
			clientY: 10,
		})
		anchor.dispatchEvent(mouseDownEvent)
		const mouseUpEvent = new MouseEvent('mouseup', {
			bubbles: true,
			cancelable: true,
			clientX: 10,
			clientY: 10,
		})
		anchor.dispatchEvent(mouseUpEvent)
		expect(mouseUpEvent.defaultPrevented).toBe(true)
	})

	test('linked-text-prevents-navigation: <p><a>text</a> クリックでも navigate 抑制される', async () => {
		const { container } = render(TipTapEditor, {
			content: '<p><a href="https://example.com">hello</a></p>',
		})

		await vi.waitFor(() => {
			const anchor = container.querySelector('.ProseMirror a')
			expect(anchor).not.toBeNull()
		})

		const pm = container.querySelector<HTMLElement>('.ProseMirror')!
		vi.spyOn(pm, 'getBoundingClientRect').mockReturnValue({
			bottom: 100,
			height: 100,
			left: 0,
			right: 800,
			toJSON: () => ({}),
			top: 0,
			width: 800,
			x: 0,
			y: 0,
		})
		Object.defineProperty(document, 'elementFromPoint', {
			configurable: true,
			value: () => pm,
			writable: true,
		})

		const anchor = container.querySelector<HTMLAnchorElement>('.ProseMirror a')!
		const mouseDownEvent = new MouseEvent('mousedown', {
			bubbles: true,
			cancelable: true,
			clientX: 10,
			clientY: 10,
		})
		anchor.dispatchEvent(mouseDownEvent)
		const mouseUpEvent = new MouseEvent('mouseup', {
			bubbles: true,
			cancelable: true,
			clientX: 10,
			clientY: 10,
		})
		anchor.dispatchEvent(mouseUpEvent)
		expect(mouseUpEvent.defaultPrevented).toBe(true)
	})
})
