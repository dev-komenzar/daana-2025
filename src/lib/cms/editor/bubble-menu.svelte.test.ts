import { fireEvent, render } from '@testing-library/svelte'
import { Editor } from '@tiptap/core'
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import { StarterKit } from '@tiptap/starter-kit'
import { afterEach, describe, expect, test, vi } from 'vitest'

import BubbleMenu from './bubble-menu.svelte'

function createEditor() {
	return new Editor({
		content: '<p>hello world</p>',
		element: document.createElement('div'),
		extensions: [StarterKit, TextStyle, Color],
	})
}

describe('BubbleMenu', () => {
	let editor: Editor

	afterEach(() => {
		editor.destroy()
	})

	test('menu-renders: editor prop が渡ると toolbar が DOM に存在する', async () => {
		editor = createEditor()
		editor.commands.setTextSelection({ from: 1, to: 6 })
		const { getByRole } = render(BubbleMenu, { editor })

		await vi.waitFor(() => {
			expect(getByRole('toolbar')).toBeTruthy()
		})
	})

	test('bold-toggles: Bold ボタンをクリックすると bold がトグルされる', async () => {
		editor = createEditor()
		editor.commands.setTextSelection({ from: 1, to: 6 })
		const { getByRole } = render(BubbleMenu, { editor })

		const boldButton = getByRole('button', { name: /bold/i })
		fireEvent.click(boldButton)

		await vi.waitFor(() => {
			expect(editor.isActive('bold')).toBe(true)
		})

		fireEvent.click(boldButton)

		await vi.waitFor(() => {
			expect(editor.isActive('bold')).toBe(false)
		})
	})

	test('italic-toggles: Italic ボタンをクリックすると italic がトグルされる', async () => {
		editor = createEditor()
		editor.commands.setTextSelection({ from: 1, to: 6 })
		const { getByRole } = render(BubbleMenu, { editor })

		const button = getByRole('button', { name: /italic/i })
		fireEvent.click(button)

		await vi.waitFor(() => {
			expect(editor.isActive('italic')).toBe(true)
		})

		fireEvent.click(button)

		await vi.waitFor(() => {
			expect(editor.isActive('italic')).toBe(false)
		})
	})

	test('underline-toggles: Underline ボタンをクリックすると underline がトグルされる', async () => {
		editor = createEditor()
		editor.commands.setTextSelection({ from: 1, to: 6 })
		const { getByRole } = render(BubbleMenu, { editor })

		const button = getByRole('button', { name: /underline/i })
		fireEvent.click(button)

		await vi.waitFor(() => {
			expect(editor.isActive('underline')).toBe(true)
		})

		fireEvent.click(button)

		await vi.waitFor(() => {
			expect(editor.isActive('underline')).toBe(false)
		})
	})

	test('strike-toggles: Strike ボタンをクリックすると strike がトグルされる', async () => {
		editor = createEditor()
		editor.commands.setTextSelection({ from: 1, to: 6 })
		const { getByRole } = render(BubbleMenu, { editor })

		const button = getByRole('button', { name: /strike/i })
		fireEvent.click(button)

		await vi.waitFor(() => {
			expect(editor.isActive('strike')).toBe(true)
		})

		fireEvent.click(button)

		await vi.waitFor(() => {
			expect(editor.isActive('strike')).toBe(false)
		})
	})

	test('color-applies: カラー入力を変更すると textStyle の color が設定される', async () => {
		editor = createEditor()
		editor.commands.setTextSelection({ from: 1, to: 6 })
		const { getByLabelText } = render(BubbleMenu, { editor })

		const colorInput = getByLabelText(/color/i)
		fireEvent.input(colorInput, { target: { value: '#ff0000' } })

		await vi.waitFor(() => {
			expect(editor.getAttributes('textStyle').color).toBe('#ff0000')
		})
	})

	test('link-popover-applies: Link ボタンでポップオーバーが開き URL を設定するとリンクが適用される', async () => {
		editor = createEditor()
		editor.commands.setTextSelection({ from: 1, to: 6 })
		const { getByLabelText, getByRole } = render(BubbleMenu, { editor })

		const linkButton = getByRole('button', { name: /link/i })
		fireEvent.click(linkButton)

		await vi.waitFor(() => {
			expect(getByLabelText(/link url/i)).toBeTruthy()
		})

		const urlInput = getByLabelText(/link url/i)
		fireEvent.input(urlInput, { target: { value: 'https://example.com' } })
		fireEvent.change(urlInput, { target: { value: 'https://example.com' } })

		const applyButton = getByRole('button', { name: /apply/i })
		fireEvent.click(applyButton)

		await vi.waitFor(() => {
			expect(editor.isActive('link')).toBe(true)
			expect(editor.getAttributes('link').href).toBe('https://example.com')
		})
	})
})
