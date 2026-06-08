import type PocketBase from 'pocketbase'

import { describe, expect, test, vi } from 'vitest'

vi.mock('$lib/pb', () => ({
	buildPbFileUrl: vi.fn((collection: string, id: string, file: string, options?: { thumb?: string }) => (options?.thumb ? `https://pub.example.com/api/files/${collection}/${id}/${file}?thumb=${options.thumb}` : `https://pub.example.com/api/files/${collection}/${id}/${file}`)),
	convertAbsolutePbUrlsToReferences: vi.fn((html?: string) => html),
}))

import { buildPbFileUrl } from '$lib/pb'

import { actions, load } from './+page.server'

function createPb(overrides: Partial<{ collection: unknown }> = {}) {
	const getList = vi.fn().mockResolvedValue({
		items: [{ alt: 'Alt', file: 'img.jpg', id: 'media1' }],
		page: 1,
		perPage: 30,
		totalItems: 1,
		totalPages: 1,
	})
	const create = vi.fn().mockResolvedValue({ id: 'new-project-id' })
	const collection = vi.fn((name: string) => {
		if (name === 'media') return { getList }
		if (name === 'projects') return { create }
		return {}
	})
	const pb = { collection, ...overrides } as unknown as App.Locals['pb'] & PocketBase
	return { collection, create, getList, pb }
}

describe('cms/projects/new load', () => {
	test('happy path: media items が返る、thumbUrl が含まれる', async () => {
		vi.mocked(buildPbFileUrl).mockClear()
		const { getList, pb } = createPb()
		const event = { locals: { pb } } as unknown as Parameters<typeof load>[0]

		const data = await load(event)

		expect(getList).toHaveBeenCalledWith(1, 30, { sort: '-created' })
		expect(buildPbFileUrl).toHaveBeenCalledWith('media', 'media1', 'img.jpg', { thumb: '200x200' })
		const d = data as { mediaItems: Array<{ alt: string; id: string; thumbUrl: string }> }
		expect(d.mediaItems).toHaveLength(1)
		expect(d.mediaItems[0]).toMatchObject({ alt: 'Alt', id: 'media1', thumbUrl: 'https://pub.example.com/api/files/media/media1/img.jpg?thumb=200x200' })
	})
})

function makeNewRequest(fields: Record<string, string | string[]>) {
	const formData = new FormData()
	for (const [k, v] of Object.entries(fields)) {
		if (Array.isArray(v)) {
			for (const item of v) formData.append(k, item)
		} else {
			formData.set(k, v)
		}
	}
	return new Request('http://localhost/cms/projects/new', { body: formData, method: 'POST' })
}

describe('cms/projects/new actions.default', () => {
	test('タイトルあり → pb.create 呼び出し & 303 redirect to /cms/projects/<id>/edit', async () => {
		const { create, pb } = createPb()
		const request = makeNewRequest({ body: '<p>内容</p>', draft: 'on', title: 'プロジェクトA' })
		const event = { locals: { pb }, request } as unknown as Parameters<NonNullable<typeof actions>['default']>[0]

		await expect(actions.default!(event)).rejects.toMatchObject({
			location: '/cms/projects/new-project-id/edit',
			status: 303,
		})
		expect(create).toHaveBeenCalledWith(expect.objectContaining({ draft: true, title: 'プロジェクトA' }))
	})

	test('タイトルなし → fail(400)', async () => {
		const { pb } = createPb()
		const request = makeNewRequest({ body: '' })
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

	test('body に <script> が含まれる場合、sanitize 後の HTML が PB に保存される', async () => {
		const { create, pb } = createPb()
		const request = makeNewRequest({
			body: "<p>hello</p><script>alert('xss')</script>",
			title: 'XSS test',
		})
		const event = { locals: { pb }, request } as unknown as Parameters<NonNullable<typeof actions>['default']>[0]

		await expect(actions.default!(event)).rejects.toMatchObject({ status: 303 })
		const callArgument = create.mock.calls[0][0] as { body: string }
		expect(callArgument.body).not.toContain('<script>')
		expect(callArgument.body).toContain('<p>hello</p>')
	})
})
