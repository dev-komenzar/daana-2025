import type PocketBase from 'pocketbase'

import { describe, expect, test, vi } from 'vitest'

vi.mock('$lib/pb', () => ({
	buildPbFileUrl: vi.fn((collection: string, id: string, file: string, options?: { thumb?: string }) => (options?.thumb ? `https://pub.example.com/api/files/${collection}/${id}/${file}?thumb=${options.thumb}` : `https://pub.example.com/api/files/${collection}/${id}/${file}`)),
	convertAbsolutePbUrlsToReferences: vi.fn((html?: string) => html),
	pbPublicUrl: 'https://pub.example.com',
	resolvePbMediaReferences: vi.fn(async (html?: string) => html),
}))

import { buildPbFileUrl } from '$lib/pb'

import { actions, load } from './+page.server'

const mockRecord = {
	body: '<p>内容</p>',
	draft: false,
	id: 'proj1',
	original_id: '',
	projectLink: 'https://example.com',
	published_at: '2025-01-01T00:00:00.000Z',
	title: '既存プロジェクト',
	type: ['music'],
}

function createPb(overrides: { getOneError?: Error } = {}) {
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
		if (name === 'projects') return { getOne, update }
		return {}
	})
	const pb = { collection } as unknown as App.Locals['pb'] & PocketBase
	return { collection, getList, getOne, pb, update }
}

describe('cms/projects/[id]/edit load', () => {
	test('happy path: projects + media items が返る', async () => {
		vi.mocked(buildPbFileUrl).mockClear()
		const { getList, getOne, pb } = createPb()
		const event = {
			locals: { pb },
			params: { id: 'proj1' },
		} as unknown as Parameters<typeof load>[0]

		const data = await load(event)

		expect(getOne).toHaveBeenCalledWith('proj1')
		expect(getList).toHaveBeenCalledWith(1, 30, { sort: '-created' })
		expect(buildPbFileUrl).toHaveBeenCalledWith('media', 'media1', 'img.jpg', { thumb: '200x200' })
		const d = data as { mediaItems: unknown[]; record: { id: string; title: string } }
		expect(d.record).toMatchObject({ id: 'proj1', title: '既存プロジェクト' })
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

function makeEditRequest(fields: Record<string, string | string[]>) {
	const formData = new FormData()
	for (const [k, v] of Object.entries(fields)) {
		if (Array.isArray(v)) {
			for (const item of v) formData.append(k, item)
		} else {
			formData.set(k, v)
		}
	}
	return new Request('http://localhost/cms/projects/proj1/edit', { body: formData, method: 'POST' })
}

describe('cms/projects/[id]/edit actions.default', () => {
	test('タイトルあり → pb.update 呼び出し & 303 redirect to /cms/projects', async () => {
		const { pb, update } = createPb()
		const request = makeEditRequest({ body: '<p>updated</p>', title: '更新プロジェクト', type: ['art'] })
		const event = {
			locals: { pb },
			params: { id: 'proj1' },
			request,
		} as unknown as Parameters<NonNullable<typeof actions>['default']>[0]

		await expect(actions.default!(event)).rejects.toMatchObject({
			location: '/cms/projects',
			status: 303,
		})
		expect(update).toHaveBeenCalledWith('proj1', expect.objectContaining({ title: '更新プロジェクト' }))
	})

	test('タイトルなし → fail(400)', async () => {
		const { pb } = createPb()
		const request = makeEditRequest({ body: '' })
		const event = {
			locals: { pb },
			params: { id: 'proj1' },
			request,
		} as unknown as Parameters<NonNullable<typeof actions>['default']>[0]

		const result = await actions.default!(event)
		expect(result?.status).toBe(400)
	})

	test('body に <script> が含まれる場合、sanitize 後の HTML が PB に保存される', async () => {
		const { pb, update } = createPb()
		const request = makeEditRequest({
			body: "<p>updated</p><script>alert('xss')</script>",
			title: 'XSS test',
		})
		const event = {
			locals: { pb },
			params: { id: 'proj1' },
			request,
		} as unknown as Parameters<NonNullable<typeof actions>['default']>[0]

		await expect(actions.default!(event)).rejects.toMatchObject({ status: 303 })
		const callArgument = update.mock.calls[0][1] as { body: string }
		expect(callArgument.body).not.toContain('<script>')
		expect(callArgument.body).toContain('<p>updated</p>')
	})
})
