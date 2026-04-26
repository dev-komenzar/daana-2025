import type { AuthModel } from 'pocketbase'

import { render } from '@testing-library/svelte'
import { describe, expect, test, vi } from 'vitest'

import Page from './+page.svelte'

type MediaItem = {
	alt: string
	fileName: string
	height: number | undefined
	id: string
	thumbUrl: string
	width: number | undefined
}

function makeItem(overrides: Partial<MediaItem> & { id: string }): MediaItem {
	return {
		alt: 'Test image',
		fileName: 'test.jpg',
		height: undefined,
		thumbUrl: 'https://example.com/thumb.jpg',
		width: undefined,
		...overrides,
	}
}

// eslint-disable-next-line unicorn/no-null -- PocketBase AuthModel can be null
const nullUser: AuthModel = null

function makeData(items: MediaItem[], page: number, totalPages: number, q = '') {
	return { items, page, perPage: 30, q, totalPages, user: nullUser }
}

describe('cms/media +page.svelte', () => {
	test('グリッドが items の件数分カードをレンダリングする', () => {
		const items = [makeItem({ fileName: 'a.jpg', id: '1' }), makeItem({ fileName: 'b.jpg', id: '2' }), makeItem({ fileName: 'c.jpg', id: '3' })]
		const { getAllByRole } = render(Page, { data: makeData(items, 1, 1) })

		const imgs = getAllByRole('img')
		expect(imgs).toHaveLength(3)
	})

	test('各カードの img の alt が item.alt に一致する', () => {
		const items = [makeItem({ alt: '鐘楼', id: '1' }), makeItem({ alt: '本堂', id: '2' })]
		const { getAllByRole } = render(Page, { data: makeData(items, 1, 1) })

		const imgs = getAllByRole('img')
		expect(imgs[0]).toHaveAttribute('alt', '鐘楼')
		expect(imgs[1]).toHaveAttribute('alt', '本堂')
	})

	test('各カードの img の src が item.thumbUrl に一致する', () => {
		const items = [makeItem({ id: '1', thumbUrl: 'https://pb.example.com/thumb/abc.jpg' })]
		const { getByRole } = render(Page, { data: makeData(items, 1, 1) })

		expect(getByRole('img')).toHaveAttribute('src', 'https://pb.example.com/thumb/abc.jpg')
	})

	test('検索フォームに name="q" の input があり、現在の q が prefill される', () => {
		const items = [makeItem({ id: '1' })]
		const { getByRole } = render(Page, { data: makeData(items, 1, 1, 'temple') })

		const input = getByRole('searchbox')
		expect(input).toHaveAttribute('name', 'q')
		// Svelte 5 sets input value via DOM property; use toHaveValue for runtime value check
		expect(input).toHaveValue('temple')
	})

	test('totalPages > 1 なら prev/next リンクが表示される (中間ページ)', () => {
		const items = [makeItem({ id: '1' })]
		const { getByRole } = render(Page, { data: makeData(items, 2, 3) })

		expect(getByRole('link', { name: '前へ' })).toHaveAttribute('href', '/cms/media?page=1')
		expect(getByRole('link', { name: '次へ' })).toHaveAttribute('href', '/cms/media?page=3')
	})

	test('q がある場合、ページングリンクに q パラメータが付く', () => {
		const items = [makeItem({ id: '1' })]
		const { getByRole } = render(Page, { data: makeData(items, 2, 3, 'temple') })

		expect(getByRole('link', { name: '前へ' })).toHaveAttribute('href', '/cms/media?page=1&q=temple')
		expect(getByRole('link', { name: '次へ' })).toHaveAttribute('href', '/cms/media?page=3&q=temple')
	})

	test('totalPages <= 1 ならページングナビが表示されない', () => {
		const items = [makeItem({ id: '1' })]
		const { queryByRole } = render(Page, { data: makeData(items, 1, 1) })

		expect(queryByRole('navigation')).toBeNull()
	})

	test('items が空なら「該当なし」メッセージが表示される', () => {
		const { getByText } = render(Page, { data: makeData([], 1, 0) })

		expect(getByText(/該当するメディアがありません/)).toBeTruthy()
	})

	test('items が空なら画像カードは表示されない', () => {
		const { queryAllByRole } = render(Page, { data: makeData([], 1, 0) })

		expect(queryAllByRole('img')).toHaveLength(0)
	})

	test('「+ アップロード」リンクが /cms/media/upload を指す', () => {
		const { getByTestId } = render(Page, { data: makeData([], 1, 0) })

		expect(getByTestId('upload-link')).toHaveAttribute('href', '/cms/media/upload')
	})

	test('各カードに削除ボタンが存在する', () => {
		const items = [makeItem({ id: 'abc' }), makeItem({ id: 'xyz' })]
		const { getAllByTestId } = render(Page, { data: makeData(items, 1, 1) })

		expect(getAllByTestId('delete-button')).toHaveLength(2)
	})

	test('削除フォームが ?/delete を action に持ち、id が hidden input に含まれる', () => {
		const items = [makeItem({ id: 'abc123' })]
		const { container } = render(Page, { data: makeData(items, 1, 1) })

		const form = container.querySelector('form[action="?/delete"]') as HTMLFormElement
		expect(form).toBeTruthy()
		const hidden = form.querySelector('input[name="id"]') as HTMLInputElement
		expect(hidden.value).toBe('abc123')
	})

	test('削除ボタンを押すと confirm が呼ばれ、キャンセル時は preventDefault される', () => {
		const items = [makeItem({ id: 'abc123' })]
		const confirmSpy = vi.spyOn(globalThis, 'confirm').mockReturnValue(false)
		const { container } = render(Page, { data: makeData(items, 1, 1) })

		const form = container.querySelector('form[action="?/delete"]') as HTMLFormElement
		const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
		form.dispatchEvent(submitEvent)

		expect(confirmSpy).toHaveBeenCalled()
		expect(submitEvent.defaultPrevented).toBe(true)
		confirmSpy.mockRestore()
	})

	test('削除ボタンを押して確定すると preventDefault されない', () => {
		const items = [makeItem({ id: 'abc123' })]
		const confirmSpy = vi.spyOn(globalThis, 'confirm').mockReturnValue(true)
		const { container } = render(Page, { data: makeData(items, 1, 1) })

		const form = container.querySelector('form[action="?/delete"]') as HTMLFormElement
		const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
		form.dispatchEvent(submitEvent)

		expect(submitEvent.defaultPrevented).toBe(false)
		confirmSpy.mockRestore()
	})
})
