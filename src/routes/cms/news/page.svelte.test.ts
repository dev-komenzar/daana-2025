import type { AuthModel } from 'pocketbase'

import { render } from '@testing-library/svelte'
import { describe, expect, test, vi } from 'vitest'

import Page from './+page.svelte'

type NewsItem = {
	draft: boolean
	id: string
	pinned: boolean
	published_at?: string
	title?: string
}

function makeItem(overrides: Partial<NewsItem> & { id: string }): NewsItem {
	return { draft: false, pinned: false, ...overrides }
}

// eslint-disable-next-line unicorn/no-null -- PocketBase AuthModel can be null
const nullUser: AuthModel = null

function makeData(items: NewsItem[], page: number, totalPages: number) {
	return { items, page, perPage: 20, totalPages, user: nullUser }
}

describe('cms/news +page.svelte', () => {
	test('テーブルが items の行数分レンダリングされる', () => {
		const items = [makeItem({ id: '1', title: 'ニュース1' }), makeItem({ id: '2', title: 'ニュース2' })]
		const { getAllByRole } = render(Page, { data: makeData(items, 1, 1) })

		const rows = getAllByRole('row')
		// thead の 1 行 + tbody の 2 行
		expect(rows).toHaveLength(3)
	})

	test('draft: true のレコードに「下書き」バッジが表示される', () => {
		const items = [makeItem({ draft: true, id: '1', title: '下書き記事' }), makeItem({ id: '2', title: '公開記事' })]
		const { getAllByText, queryAllByText } = render(Page, { data: makeData(items, 1, 1) })

		expect(getAllByText('下書き')).toHaveLength(1)
		expect(queryAllByText('固定')).toHaveLength(0)
	})

	test('pinned: true のレコードに「固定」バッジが表示される', () => {
		const items = [makeItem({ id: '1', pinned: true, title: '固定記事' })]
		const { getAllByText } = render(Page, { data: makeData(items, 1, 1) })

		expect(getAllByText('固定')).toHaveLength(1)
	})

	test('draft: false + 未来の published_at のレコードに「予約公開」バッジが表示される', () => {
		const future = new Date(Date.now() + 86_400_000).toISOString()
		const items = [makeItem({ draft: false, id: '1', published_at: future, title: '予約記事' })]
		const { getAllByText, queryAllByText } = render(Page, { data: makeData(items, 1, 1) })

		expect(getAllByText('予約公開')).toHaveLength(1)
		expect(queryAllByText('下書き')).toHaveLength(0)
	})

	test('draft: false + 過去の published_at のレコードには「予約公開」バッジが表示されない', () => {
		const items = [makeItem({ draft: false, id: '1', published_at: '2020-01-01T00:00:00.000Z', title: '公開済み記事' })]
		const { queryAllByText } = render(Page, { data: makeData(items, 1, 1) })

		expect(queryAllByText('予約公開')).toHaveLength(0)
	})

	test('各行に /cms/news/<id>/edit へのリンクが存在する', () => {
		const items = [makeItem({ id: 'abc123', title: '記事' }), makeItem({ id: 'xyz789', title: '記事2' })]
		const { getAllByRole } = render(Page, { data: makeData(items, 1, 1) })

		const editLinks = getAllByRole('link', { name: '編集' })
		expect(editLinks).toHaveLength(2)
		const hrefs = editLinks.map(l => l.getAttribute('href'))
		expect(hrefs).toContain('/cms/news/abc123/edit')
		expect(hrefs).toContain('/cms/news/xyz789/edit')
	})

	test('totalPages > 1 なら prev/next リンクが表示される (中間ページ)', () => {
		const items = [makeItem({ id: '1' })]
		const { getByRole } = render(Page, { data: makeData(items, 2, 3) })

		expect(getByRole('link', { name: '前へ' })).toHaveAttribute('href', '/cms/news?page=1')
		expect(getByRole('link', { name: '次へ' })).toHaveAttribute('href', '/cms/news?page=3')
	})

	test('ページ 1 では prev リンクが表示されない', () => {
		const items = [makeItem({ id: '1' })]
		const { queryByRole } = render(Page, { data: makeData(items, 1, 3) })

		expect(queryByRole('link', { name: '前へ' })).toBeNull()
		expect(queryByRole('link', { name: '次へ' })).toHaveAttribute('href', '/cms/news?page=2')
	})

	test('最終ページでは next リンクが表示されない', () => {
		const items = [makeItem({ id: '1' })]
		const { queryByRole } = render(Page, { data: makeData(items, 3, 3) })

		expect(queryByRole('link', { name: '前へ' })).toHaveAttribute('href', '/cms/news?page=2')
		expect(queryByRole('link', { name: '次へ' })).toBeNull()
	})

	test('totalPages <= 1 ならページングナビが表示されない', () => {
		const items = [makeItem({ id: '1' })]
		const { queryByRole } = render(Page, { data: makeData(items, 1, 1) })

		expect(queryByRole('navigation')).toBeNull()
	})

	test('published_at が存在すれば YYYY-MM-DD 形式で表示される', () => {
		const items = [makeItem({ id: '1', published_at: '2025-03-15 10:00:00.000Z', title: '日付テスト' })]
		const { getByText } = render(Page, { data: makeData(items, 1, 1) })

		expect(getByText('2025-03-15')).toBeTruthy()
	})

	test('published_at が未設定なら「—」が表示される', () => {
		const items = [makeItem({ id: '1', title: '日付なし' })]
		const { getByText } = render(Page, { data: makeData(items, 1, 1) })

		expect(getByText('—')).toBeTruthy()
	})

	test('各行に 削除 ボタンを含むフォームがあり、action は ?/delete', () => {
		const items = [makeItem({ id: 'abc123', title: '記事' })]
		const { container } = render(Page, { data: makeData(items, 1, 1) })

		const deleteButtons = container.querySelectorAll('button[data-testid="delete-button"]')
		expect(deleteButtons).toHaveLength(1)
		const form = deleteButtons[0].closest('form')!
		expect(form.getAttribute('method')?.toLowerCase()).toBe('post')
		expect(form.getAttribute('action')).toBe('?/delete')
		const hidden = form.querySelector('input[name="id"]') as HTMLInputElement | null
		expect(hidden?.value).toBe('abc123')
	})

	test('削除ボタンを押すと confirm が呼ばれる; キャンセル時は preventDefault される', () => {
		const items = [makeItem({ id: 'abc123', title: '記事' })]
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
		const items = [makeItem({ id: 'abc123', title: '記事' })]
		const confirmSpy = vi.spyOn(globalThis, 'confirm').mockReturnValue(true)
		const { container } = render(Page, { data: makeData(items, 1, 1) })
		const form = container.querySelector('form[action="?/delete"]') as HTMLFormElement
		const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
		form.dispatchEvent(submitEvent)
		expect(submitEvent.defaultPrevented).toBe(false)
		confirmSpy.mockRestore()
	})
})
