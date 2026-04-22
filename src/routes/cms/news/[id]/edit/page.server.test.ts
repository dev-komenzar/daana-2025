import type PocketBase from 'pocketbase'

import { describe, expect, test, vi } from 'vitest'

import { actions, load } from './+page.server'

const mockRecord = {
	content: '<p>内容</p>',
	draft: false,
	id: 'rec1',
	pinned: true,
	published_at: '2025-01-01T00:00:00.000Z',
	thumbnail: 'media-id',
	title: '既存タイトル',
}

function createPb(overrides: { getOneError?: Error } = {}) {
	const filesGetUrl = vi.fn(() => 'https://example.com/img.jpg')
	const getList = vi.fn().mockResolvedValue({
		items: [{ alt: 'Alt', file: 'img.jpg', id: 'media1' }],
		page: 1,
		perPage: 30,
		totalItems: 1,
		totalPages: 1,
	})
	const getOne = overrides.getOneError ? vi.fn().mockRejectedValue(overrides.getOneError) : vi.fn().mockResolvedValue(mockRecord)
	const update = vi.fn().mockResolvedValue(mockRecord)
	const collection = vi.fn((name: string) => {
		if (name === 'media') return { getList }
		if (name === 'news') return { getOne, update }
		return {}
	})
	const files = { getUrl: filesGetUrl }
	const pb = { collection, files } as unknown as App.Locals['pb'] & PocketBase
	return { collection, files, filesGetUrl, getList, getOne, pb, update }
}

describe('cms/news/[id]/edit load', () => {
	test('happy path: news + media items が返る', async () => {
		const { getList, getOne, pb } = createPb()
		const event = {
			locals: { pb },
			params: { id: 'rec1' },
		} as unknown as Parameters<typeof load>[0]

		const data = await load(event)

		expect(getOne).toHaveBeenCalledWith('rec1')
		expect(getList).toHaveBeenCalledWith(1, 30, { sort: '-created' })
		const d = data as { mediaItems: unknown[]; record: { id: string; title: string } }
		expect(d.record).toMatchObject({ id: 'rec1', title: '既存タイトル' })
		expect(d.mediaItems).toHaveLength(1)
	})

	test('getOne が throw → SvelteKit error 404', async () => {
		const { pb } = createPb({ getOneError: new Error('Not found') })
		const event = {
			locals: { pb },
			params: { id: 'missing' },
		} as unknown as Parameters<typeof load>[0]

		await expect(load(event)).rejects.toMatchObject({ status: 404 })
	})
})

function makeEditRequest(fields: Record<string, string>) {
	const formData = new FormData()
	for (const [k, v] of Object.entries(fields)) formData.set(k, v)
	return new Request('http://localhost/cms/news/rec1/edit', { body: formData, method: 'POST' })
}

describe('cms/news/[id]/edit actions.default', () => {
	test('タイトルあり → pb.update 呼び出し & 303 redirect to /cms/news', async () => {
		const { pb, update } = createPb()
		const request = makeEditRequest({ content: '<p>updated</p>', pinned: 'on', title: '更新タイトル' })
		const event = {
			locals: { pb },
			params: { id: 'rec1' },
			request,
		} as unknown as Parameters<NonNullable<typeof actions>['default']>[0]

		await expect(actions.default!(event)).rejects.toMatchObject({
			location: '/cms/news',
			status: 303,
		})
		expect(update).toHaveBeenCalledWith('rec1', expect.objectContaining({ pinned: true, title: '更新タイトル' }))
	})

	test('タイトルなし → fail(400)', async () => {
		const { pb } = createPb()
		const request = makeEditRequest({ content: '' })
		const event = {
			locals: { pb },
			params: { id: 'rec1' },
			request,
		} as unknown as Parameters<NonNullable<typeof actions>['default']>[0]

		const result = await actions.default!(event)
		expect(result?.status).toBe(400)
	})

	test('content に <script> が含まれる場合、sanitize 後の HTML が PB に保存される', async () => {
		const { pb, update } = createPb()
		const request = makeEditRequest({
			content: "<p>updated</p><script>alert('xss')</script>",
			title: 'XSS test',
		})
		const event = {
			locals: { pb },
			params: { id: 'rec1' },
			request,
		} as unknown as Parameters<NonNullable<typeof actions>['default']>[0]

		await expect(actions.default!(event)).rejects.toMatchObject({ status: 303 })
		const callArgument = update.mock.calls[0][1] as { content: string }
		expect(callArgument.content).not.toContain('<script>')
		expect(callArgument.content).toContain('<p>updated</p>')
	})
})
