import { fireEvent, render } from '@testing-library/svelte'
import { Editor } from '@tiptap/core'
import { Color } from '@tiptap/extension-color'
import { Image } from '@tiptap/extension-image'
import { TextStyle } from '@tiptap/extension-text-style'
import { StarterKit } from '@tiptap/starter-kit'
import { afterEach, describe, expect, test, vi } from 'vitest'

import BubbleMenu from './bubble-menu.svelte'
import { FigureExtension } from './figure-extension'

function createEditor() {
	return new Editor({
		content: '<p>hello world</p>',
		element: document.createElement('div'),
		extensions: [StarterKit, TextStyle, Color],
	})
}

function createFigureEditor(content: string) {
	return new Editor({
		content,
		element: document.createElement('div'),
		extensions: [StarterKit, TextStyle, Color, FigureExtension],
	})
}

function createImageEditor(content: string) {
	return new Editor({
		content,
		element: document.createElement('div'),
		extensions: [StarterKit, TextStyle, Color, Image.configure({ inline: true })],
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

		const saveButton = getByRole('button', { name: /保存/i })
		fireEvent.click(saveButton)

		await vi.waitFor(() => {
			expect(editor.isActive('link')).toBe(true)
			expect(editor.getAttributes('link').href).toBe('https://example.com')
		})
	})

	test('link-populated-on-image: リンク付き画像を NodeSelection すると Link ボタンで href が表示される', async () => {
		editor = createImageEditor('<p><a href="https://example.com"><img src="https://example.com/x.jpg" alt="x" /></a></p>')
		editor.commands.setNodeSelection(1)

		const { getByLabelText, getByRole } = render(BubbleMenu, { editor })

		const linkButton = getByRole('button', { name: /^link$/i })
		fireEvent.click(linkButton)

		const urlInput = (await vi.waitFor(() => {
			const element = getByLabelText(/link url/i) as HTMLInputElement
			expect(element).toBeTruthy()
			return element
		})) as HTMLInputElement

		expect(urlInput.value).toBe('https://example.com')
	})

	test('link-empty-on-image-without-link: リンク無しの画像を NodeSelection すると Link 欄は空欄', async () => {
		editor = createImageEditor('<p><img src="https://example.com/x.jpg" alt="x" /></p>')
		editor.commands.setNodeSelection(1)

		const { getByLabelText, getByRole } = render(BubbleMenu, { editor })

		const linkButton = getByRole('button', { name: /^link$/i })
		fireEvent.click(linkButton)

		const urlInput = (await vi.waitFor(() => {
			const element = getByLabelText(/link url/i) as HTMLInputElement
			expect(element).toBeTruthy()
			return element
		})) as HTMLInputElement

		expect(urlInput.value).toBe('')
	})

	test('link-applies-on-image: 画像 NodeSelection でリンクを Apply すると link mark が付与される', async () => {
		editor = createImageEditor('<p><img src="https://example.com/x.jpg" alt="x" /></p>')
		editor.commands.setNodeSelection(1)

		const { getByLabelText, getByRole } = render(BubbleMenu, { editor })

		const linkButton = getByRole('button', { name: /^link$/i })
		fireEvent.click(linkButton)

		const urlInput = (await vi.waitFor(() => {
			const element = getByLabelText(/link url/i) as HTMLInputElement
			expect(element).toBeTruthy()
			return element
		})) as HTMLInputElement

		fireEvent.input(urlInput, { target: { value: 'https://example.com/link' } })
		fireEvent.change(urlInput, { target: { value: 'https://example.com/link' } })

		const saveButton = getByRole('button', { name: /保存/i })
		fireEvent.click(saveButton)

		await vi.waitFor(() => {
			expect(editor.getAttributes('link').href).toBe('https://example.com/link')
		})

		expect(editor.getHTML()).toContain('https://example.com/link')
	})

	test('figure-link-populated: Figure 選択時に linkHref が入力欄に反映される', async () => {
		editor = createFigureEditor('<figure><a href="https://example.com/fig"><img src="https://example.com/x.jpg" alt="x" /></a></figure>')
		editor.commands.setNodeSelection(0)

		const { getByLabelText, getByRole } = render(BubbleMenu, { editor })

		const linkButton = getByRole('button', { name: /^link$/i })
		fireEvent.click(linkButton)

		const urlInput = (await vi.waitFor(() => {
			const element = getByLabelText(/link url/i) as HTMLInputElement
			expect(element).toBeTruthy()
			return element
		})) as HTMLInputElement

		expect(urlInput.value).toBe('https://example.com/fig')
	})

	test('figure-link-empty: リンク無し Figure 選択時は URL 欄が空', async () => {
		editor = createFigureEditor('<figure><img src="https://example.com/x.jpg" alt="x" /></figure>')
		editor.commands.setNodeSelection(0)

		const { getByLabelText, getByRole } = render(BubbleMenu, { editor })

		const linkButton = getByRole('button', { name: /^link$/i })
		fireEvent.click(linkButton)

		const urlInput = (await vi.waitFor(() => {
			const element = getByLabelText(/link url/i) as HTMLInputElement
			expect(element).toBeTruthy()
			return element
		})) as HTMLInputElement

		expect(urlInput.value).toBe('')
	})

	test('figure-link-applies: Figure 選択時にリンク保存すると linkHref 属性が設定される', async () => {
		editor = createFigureEditor('<figure><img src="https://example.com/x.jpg" alt="x" /></figure>')
		editor.commands.setNodeSelection(0)

		const { getByLabelText, getByRole } = render(BubbleMenu, { editor })

		const linkButton = getByRole('button', { name: /^link$/i })
		fireEvent.click(linkButton)

		const urlInput = (await vi.waitFor(() => {
			const element = getByLabelText(/link url/i) as HTMLInputElement
			expect(element).toBeTruthy()
			return element
		})) as HTMLInputElement

		fireEvent.input(urlInput, { target: { value: 'https://example.com/figlink' } })
		fireEvent.change(urlInput, { target: { value: 'https://example.com/figlink' } })

		const saveButton = getByRole('button', { name: /保存/i })
		fireEvent.click(saveButton)

		await vi.waitFor(() => {
			expect(editor.getAttributes('figure').linkHref).toBe('https://example.com/figlink')
		})

		expect(editor.getHTML()).toContain('https://example.com/figlink')
	})

	test('delete-link-removes-only-link-on-text: テキストの削除ボタンでリンクだけ除去されテキストは残る', async () => {
		editor = createEditor()
		editor.commands.setTextSelection({ from: 1, to: 6 })
		const { getByLabelText, getByRole } = render(BubbleMenu, { editor })

		const linkButton = getByRole('button', { name: /link/i })
		fireEvent.click(linkButton)
		const urlInput = getByLabelText(/link url/i)
		fireEvent.input(urlInput, { target: { value: 'https://example.com' } })
		fireEvent.change(urlInput, { target: { value: 'https://example.com' } })
		const saveButton = getByRole('button', { name: /保存/i })
		fireEvent.click(saveButton)

		await vi.waitFor(() => {
			expect(editor.isActive('link')).toBe(true)
		})

		const linkButton2 = getByRole('button', { name: /link/i })
		fireEvent.click(linkButton2)
		const deleteButton = getByRole('button', { name: /削除/i })
		fireEvent.click(deleteButton)

		await vi.waitFor(() => {
			expect(editor.isActive('link')).toBe(false)
		})

		expect(editor.getText()).toContain('hello')
	})

	test('delete-link-on-image-removes-only-link: 画像の削除ボタンでリンクだけ除去され画像は残る', async () => {
		editor = createImageEditor('<p><a href="https://example.com"><img src="https://example.com/x.jpg" alt="x" /></a></p>')
		editor.commands.setNodeSelection(1)

		const { getByRole } = render(BubbleMenu, { editor })

		const linkButton = getByRole('button', { name: /^link$/i })
		fireEvent.click(linkButton)

		const deleteButton = getByRole('button', { name: /削除/i })
		fireEvent.click(deleteButton)

		await vi.waitFor(() => {
			expect(editor.isActive('link')).toBe(false)
		})

		expect(editor.getHTML()).toContain('<img')
		expect(editor.getHTML()).not.toMatch(/<a [^>]*href="https:\/\/example\.com"/)
	})

	test('delete-link-on-figure-removes-only-link: Figure の削除ボタンでリンクだけ除去され画像は残る', async () => {
		editor = createFigureEditor('<figure><a href="https://example.com/fig"><img src="https://example.com/x.jpg" alt="x" /></a></figure>')
		editor.commands.setNodeSelection(0)

		const { getByRole } = render(BubbleMenu, { editor })

		const linkButton = getByRole('button', { name: /^link$/i })
		fireEvent.click(linkButton)

		const deleteButton = getByRole('button', { name: /削除/i })
		fireEvent.click(deleteButton)

		await vi.waitFor(() => {
			expect(editor.getAttributes('figure').linkHref).toBeUndefined()
		})

		expect(editor.getHTML()).toContain('figure')
		expect(editor.getHTML()).toContain('<img')
		expect(editor.getHTML()).not.toContain('https://example.com/fig')
	})
})
