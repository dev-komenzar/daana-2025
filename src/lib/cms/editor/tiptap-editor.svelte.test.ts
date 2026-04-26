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

	test('onUpdate callback は prop として受け取れる (spec)', () => {
		const onUpdate = vi.fn<(html: string) => void>()
		const { container } = render(TipTapEditor, { content: '<p>hi</p>', onUpdate })
		expect(container.querySelector('.tiptap-editor-root')).not.toBeNull()
	})
})
