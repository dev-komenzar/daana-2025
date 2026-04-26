import type { AuthModel } from 'pocketbase'

import { render } from '@testing-library/svelte'
import { describe, expect, test, vi } from 'vitest'

import Page from './+page.svelte'

type ProjectItem = {
	draft?: boolean
	id: string
	published_at?: string
	title?: string
	type?: string[]
}

function makeItem(overrides: Partial<ProjectItem> & { id: string }): ProjectItem {
	return { draft: false, ...overrides }
}

// eslint-disable-next-line unicorn/no-null -- PocketBase AuthModel can be null
const nullUser: AuthModel = null

function makeData(items: ProjectItem[], page: number, totalPages: number) {
	return { items, page, perPage: 20, totalPages, user: nullUser }
}

describe('cms/projects +page.svelte', () => {
	test('「新規作成」リンクが /cms/projects/new を指す', () => {
		const { getByTestId } = render(Page, { data: makeData([], 1, 1) })

		expect(getByTestId('create-link')).toHaveAttribute('href', '/cms/projects/new')
	})

	test('テーブルが items の行数分レンダリングされる', () => {
		const items = [makeItem({ id: '1', title: 'プロジェクト1' }), makeItem({ id: '2', title: 'プロジェクト2' })]
		const { getAllByRole } = render(Page, { data: makeData(items, 1, 1) })

		const rows = getAllByRole('row')
		// thead の 1 行 + tbody の 2 行
		expect(rows).toHaveLength(3)
	})

	test('type が ["mono", "hito"] のレコードに "mono, hito" が表示される', () => {
		const items = [makeItem({ id: '1', title: 'テスト', type: ['mono', 'hito'] })]
		const { getByText } = render(Page, { data: makeData(items, 1, 1) })

		expect(getByText('mono, hito')).toBeTruthy()
	})

	test('draft: true のレコードに「下書き」バッジが表示される', () => {
		const items = [makeItem({ draft: true, id: '1', title: '下書き' })]
		const { getByTestId } = render(Page, { data: makeData(items, 1, 1) })

		expect(getByTestId('badge-draft-1')).toBeTruthy()
	})

	test('各行に /cms/projects/<id>/edit へのリンクが存在する', () => {
		const items = [makeItem({ id: 'abc123', title: 'プロジェクト' })]
		const { getByTestId } = render(Page, { data: makeData(items, 1, 1) })

		expect(getByTestId('edit-link-abc123')).toHaveAttribute('href', '/cms/projects/abc123/edit')
	})

	test('各行に 削除 ボタンを含むフォームがあり、action は ?/delete', () => {
		const items = [makeItem({ id: 'abc123', title: 'プロジェクト' })]
		const { container } = render(Page, { data: makeData(items, 1, 1) })

		const deleteButtons = container.querySelectorAll('button[data-testid="delete-button"]')
		expect(deleteButtons).toHaveLength(1)
		const form = deleteButtons[0].closest('form')!
		expect(form.getAttribute('action')).toBe('?/delete')
		const hidden = form.querySelector('input[name="id"]') as HTMLInputElement | null
		expect(hidden?.value).toBe('abc123')
	})

	test('削除ボタンを押すと confirm が呼ばれる; キャンセル時は preventDefault される', () => {
		const items = [makeItem({ id: 'abc123', title: 'プロジェクト' })]
		const confirmSpy = vi.spyOn(globalThis, 'confirm').mockReturnValue(false)
		const { container } = render(Page, { data: makeData(items, 1, 1) })
		const form = container.querySelector('form[action="?/delete"]') as HTMLFormElement
		const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
		form.dispatchEvent(submitEvent)
		expect(confirmSpy).toHaveBeenCalled()
		expect(submitEvent.defaultPrevented).toBe(true)
		confirmSpy.mockRestore()
	})

	test('totalPages > 1 なら prev/next リンクが表示される (中間ページ)', () => {
		const items = [makeItem({ id: '1' })]
		const { getByTestId } = render(Page, { data: makeData(items, 2, 3) })

		expect(getByTestId('page-prev')).toHaveAttribute('href', '/cms/projects?page=1')
		expect(getByTestId('page-next')).toHaveAttribute('href', '/cms/projects?page=3')
	})

	test('totalPages <= 1 ならページングナビが表示されない', () => {
		const items = [makeItem({ id: '1' })]
		const { queryByRole } = render(Page, { data: makeData(items, 1, 1) })

		expect(queryByRole('navigation')).toBeNull()
	})
})
