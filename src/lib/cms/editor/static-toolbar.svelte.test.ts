import { fireEvent, render } from '@testing-library/svelte'
import { Editor } from '@tiptap/core'
import { Image } from '@tiptap/extension-image'
import { Table, TableCell, TableHeader, TableRow } from '@tiptap/extension-table'
import { StarterKit } from '@tiptap/starter-kit'
import { afterEach, describe, expect, test, vi } from 'vitest'

import StaticToolbar from './static-toolbar.svelte'

function createEditor() {
	return new Editor({
		content: '<p>初期</p>',
		element: document.createElement('div'),
		extensions: [StarterKit, Image, Table.configure({ resizable: true }), TableCell, TableHeader, TableRow],
	})
}

describe('StaticToolbar', () => {
	let editor: Editor

	afterEach(() => {
		editor.destroy()
	})

	test('renders-toolbar: role=toolbar と aria-label が DOM に存在する', async () => {
		editor = createEditor()
		const { getByRole } = render(StaticToolbar, { editor })

		await vi.waitFor(() => {
			expect(getByRole('toolbar', { name: 'Editor toolbar' })).toBeTruthy()
		})
	})

	test('image-button-triggers-callback: Image ボタンクリックで onInsertImage が呼ばれる', async () => {
		editor = createEditor()
		const onInsertImage = vi.fn()
		const { getByRole } = render(StaticToolbar, { editor, onInsertImage })

		fireEvent.click(getByRole('button', { name: 'Image' }))

		await vi.waitFor(() => {
			expect(onInsertImage).toHaveBeenCalledOnce()
		})
	})

	test('table-button-inserts-table: Table ボタンクリックでテーブルノードが挿入される', async () => {
		editor = createEditor()
		const { getByRole } = render(StaticToolbar, { editor })

		fireEvent.click(getByRole('button', { name: 'Table' }))

		await vi.waitFor(() => {
			expect(editor.isActive('table')).toBe(true)
		})
	})

	test('undo-button-undoes: Undo ボタンクリックで直前の変更が取り消される', async () => {
		editor = createEditor()
		editor.commands.insertContent('hello')
		const { getByRole } = render(StaticToolbar, { editor })

		expect(editor.getText()).toContain('hello')

		fireEvent.click(getByRole('button', { name: 'Undo' }))

		await vi.waitFor(() => {
			expect(editor.getText()).not.toContain('hello')
		})
	})

	test('redo-button-redoes: Undo 後に Redo ボタンで変更が復元される', async () => {
		editor = createEditor()
		editor.commands.insertContent('hello')
		const { getByRole } = render(StaticToolbar, { editor })

		fireEvent.click(getByRole('button', { name: 'Undo' }))

		await vi.waitFor(() => {
			expect(editor.getText()).not.toContain('hello')
		})

		fireEvent.click(getByRole('button', { name: 'Redo' }))

		await vi.waitFor(() => {
			expect(editor.getText()).toContain('hello')
		})
	})

	test('save-button-triggers-callback: Save ボタンクリックで onSave が現在の HTML で呼ばれる', async () => {
		editor = createEditor()
		const onSave = vi.fn()
		const { getByRole } = render(StaticToolbar, { editor, onSave })

		fireEvent.click(getByRole('button', { name: 'Save' }))

		await vi.waitFor(() => {
			expect(onSave).toHaveBeenCalledOnce()
			expect(onSave).toHaveBeenCalledWith(editor.getHTML())
		})
	})
})
