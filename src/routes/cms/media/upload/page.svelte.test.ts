import { fireEvent, render } from '@testing-library/svelte'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import Page from './+page.svelte'

function createFileList(...files: File[]): FileList {
	const list: Record<number | string | symbol, unknown> = {
		// eslint-disable-next-line unicorn/no-null
		item: (index: number) => files[index] ?? null,
		length: files.length,
		[Symbol.iterator]: function* () {
			yield* files
		},
	}
	for (const [index, file] of files.entries()) list[index] = file
	return list as unknown as FileList
}

function setInputFiles(input: HTMLInputElement, ...files: File[]) {
	Object.defineProperty(input, 'files', { configurable: true, value: createFileList(...files) })
}

describe('cms/media/upload +page.svelte', () => {
	beforeEach(() => {
		URL.createObjectURL = vi.fn(() => 'blob:test-preview')
		URL.revokeObjectURL = vi.fn()
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	test('file input がある', () => {
		const { container } = render(Page, { form: undefined })
		const input = container.querySelector('input[type="file"]')
		expect(input).toBeTruthy()
		expect(input).toHaveAttribute('name', 'file')
	})

	test('alt input がある', () => {
		const { container } = render(Page, { form: undefined })
		const input = container.querySelector('input[name="alt"]')
		expect(input).toBeTruthy()
	})

	test('submit ボタンがある', () => {
		const { getByRole } = render(Page, { form: undefined })
		const button = getByRole('button', { name: /アップロード/ })
		expect(button).toBeTruthy()
	})

	test('DnD ドロップゾーン要素がある', () => {
		const { container } = render(Page, { form: undefined })
		const dropzone = container.querySelector('[aria-label="dropzone"]')
		expect(dropzone).toBeTruthy()
	})

	test('form.error が set されているとエラーが表示される', () => {
		const { getByRole } = render(Page, { form: { error: 'ファイルを選択してください' } })
		const alert = getByRole('alert')
		expect(alert).toBeTruthy()
		expect(alert.textContent).toContain('ファイルを選択してください')
	})

	test('form が null ならエラーメッセージは表示されない', () => {
		const { queryByRole } = render(Page, { form: undefined })
		expect(queryByRole('alert')).toBeNull()
	})

	test('初期状態ではプレビュー画像とファイル名は表示されない', () => {
		const { container, queryByTestId } = render(Page, { form: undefined })
		expect(container.querySelector('img[alt="選択中の画像プレビュー"]')).toBeNull()
		expect(queryByTestId('preview-filename')).toBeNull()
	})

	test('画像ファイルを選択するとプレビューとファイル名が表示される', async () => {
		const { container, getByTestId } = render(Page, { form: undefined })
		const input = container.querySelector('input[type="file"]') as HTMLInputElement
		const file = new File(['x'], 'photo.jpg', { type: 'image/jpeg' })
		setInputFiles(input, file)
		await fireEvent.change(input)

		const img = container.querySelector('img[alt="選択中の画像プレビュー"]')
		expect(img).toBeTruthy()
		expect(img).toHaveAttribute('src', 'blob:test-preview')
		expect(getByTestId('preview-filename').textContent).toContain('photo.jpg')
	})

	test('×ボタンで選択がクリアされ初期状態に戻る', async () => {
		const { container, getByRole, queryByTestId } = render(Page, { form: undefined })
		const input = container.querySelector('input[type="file"]') as HTMLInputElement
		const file = new File(['x'], 'photo.jpg', { type: 'image/jpeg' })
		setInputFiles(input, file)
		await fireEvent.change(input)
		expect(container.querySelector('img[alt="選択中の画像プレビュー"]')).toBeTruthy()

		const clearButton = getByRole('button', { name: '選択した画像を取り消す' })
		await fireEvent.click(clearButton)

		expect(container.querySelector('img[alt="選択中の画像プレビュー"]')).toBeNull()
		expect(queryByTestId('preview-filename')).toBeNull()
	})

	test('非画像ファイル選択でエラー表示、プレビューは出ない', async () => {
		const { container, getByRole, queryByTestId } = render(Page, { form: undefined })
		const input = container.querySelector('input[type="file"]') as HTMLInputElement
		const file = new File(['x'], 'doc.pdf', { type: 'application/pdf' })
		setInputFiles(input, file)
		await fireEvent.change(input)

		const alert = getByRole('alert')
		expect(alert.textContent).toContain('画像ファイルを選択してください')
		expect(container.querySelector('img[alt="選択中の画像プレビュー"]')).toBeNull()
		expect(queryByTestId('preview-filename')).toBeNull()
	})

	test('プレビュー表示中に非画像ファイルが来ても既存プレビューは保持される', async () => {
		const { container, getByRole, getByTestId } = render(Page, { form: undefined })
		const input = container.querySelector('input[type="file"]') as HTMLInputElement

		const goodFile = new File(['x'], 'photo.jpg', { type: 'image/jpeg' })
		setInputFiles(input, goodFile)
		await fireEvent.change(input)

		const dropzone = container.querySelector('[aria-label="dropzone"]') as HTMLElement
		const badFile = new File(['x'], 'doc.pdf', { type: 'application/pdf' })
		await fireEvent.drop(dropzone, { dataTransfer: { files: createFileList(badFile) } })

		expect(getByRole('alert').textContent).toContain('画像ファイルを選択してください')
		expect(container.querySelector('img[alt="選択中の画像プレビュー"]')).toBeTruthy()
		expect(getByTestId('preview-filename').textContent).toContain('photo.jpg')
	})
})
