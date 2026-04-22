import type PocketBase from 'pocketbase'

import { describe, expect, test, vi } from 'vitest'

import { actions, load } from './+page.server'

function createPb(overrides: Partial<{ collection: unknown; files: unknown }> = {}) {
	const filesGetUrl = vi.fn(() => 'https://example.com/img.jpg')
	const getList = vi.fn().mockResolvedValue({
		items: [{ alt: 'Alt', file: 'img.jpg', id: 'media1' }],
		page: 1,
		perPage: 30,
		totalItems: 1,
		totalPages: 1,
	})
	const create = vi.fn().mockResolvedValue({ id: 'new-record-id' })
	const collection = vi.fn((name: string) => {
		if (name === 'media') return { getList }
		if (name === 'news') return { create }
		return {}
	})
	const files = { getUrl: filesGetUrl }
	const pb = { collection, files, ...overrides } as unknown as App.Locals['pb'] & PocketBase
	return { collection, create, files, filesGetUrl, getList, pb }
}

describe('cms/news/new load', () => {
	test('happy path: media items が返る、thumbUrl が含まれる', async () => {
		const { filesGetUrl, getList, pb } = createPb()
		const event = { locals: { pb } } as unknown as Parameters<typeof load>[0]

		const data = await load(event)

		expect(getList).toHaveBeenCalledWith(1, 30, { sort: '-created' })
		expect(filesGetUrl).toHaveBeenCalledWith(expect.objectContaining({ id: 'media1' }), 'img.jpg', { thumb: '200x200' })
		const d = data as { mediaItems: Array<{ alt: string; id: string; thumbUrl: string }> }
		expect(d.mediaItems).toHaveLength(1)
		expect(d.mediaItems[0]).toMatchObject({ alt: 'Alt', id: 'media1', thumbUrl: 'https://example.com/img.jpg' })
	})
})

function makeNewRequest(fields: Record<string, string>) {
	const formData = new FormData()
	for (const [k, v] of Object.entries(fields)) formData.set(k, v)
	return new Request('http://localhost/cms/news/new', { body: formData, method: 'POST' })
}

describe('cms/news/new actions.default', () => {
	test('タイトルあり → pb.create 呼び出し & 303 redirect to /cms/news/<id>/edit', async () => {
		const { create, pb } = createPb()
		const request = makeNewRequest({ content: '<p>hello</p>', draft: 'on', title: 'テスト' })
		const event = { locals: { pb }, request } as unknown as Parameters<NonNullable<typeof actions>['default']>[0]

		await expect(actions.default!(event)).rejects.toMatchObject({
			location: '/cms/news/new-record-id/edit',
			status: 303,
		})
		expect(create).toHaveBeenCalledWith(expect.objectContaining({ draft: true, pinned: false, title: 'テスト' }))
	})

	test('タイトルなし → fail(400)', async () => {
		const { pb } = createPb()
		const request = makeNewRequest({ content: '' })
		const event = { locals: { pb }, request } as unknown as Parameters<NonNullable<typeof actions>['default']>[0]

		const result = await actions.default!(event)
		expect(result?.status).toBe(400)
	})

	test('datetime-local 文字列が ISO 形式で PB へ渡る', async () => {
		const { create, pb } = createPb()
		const request = makeNewRequest({ published_at: '2025-06-15T10:30', title: 'Datetime test' })
		const event = { locals: { pb }, request } as unknown as Parameters<NonNullable<typeof actions>['default']>[0]

		await expect(actions.default!(event)).rejects.toMatchObject({ status: 303 })
		const callArgument = create.mock.calls[0][0] as { published_at: string }
		// Should be valid ISO string
		expect(new Date(callArgument.published_at).toISOString()).toBe(callArgument.published_at)
	})

	test('published_at 未指定 → 空文字で PB へ渡る', async () => {
		const { create, pb } = createPb()
		const request = makeNewRequest({ title: 'No date' })
		const event = { locals: { pb }, request } as unknown as Parameters<NonNullable<typeof actions>['default']>[0]

		await expect(actions.default!(event)).rejects.toMatchObject({ status: 303 })
		const callArgument = create.mock.calls[0][0] as { published_at: string }
		expect(callArgument.published_at).toBe('')
	})
})
