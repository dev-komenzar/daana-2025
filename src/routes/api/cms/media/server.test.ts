import type PocketBase from 'pocketbase'

import { describe, expect, test, vi } from 'vitest'

import { GET } from './+server'

type Locals = App.Locals & { user?: { role: string } }

function createEvent(locals: Partial<Locals>, search: string): Parameters<typeof GET>[0] {
	return {
		locals,
		url: new URL(`http://localhost/api/cms/media${search}`),
	} as unknown as Parameters<typeof GET>[0]
}

function createMocks(result: object) {
	const getList = vi.fn().mockResolvedValue(result)
	const collection = vi.fn(() => ({ getList }))
	const filter = vi.fn((raw: string, parameters: Record<string, unknown>) => `interpolated:${raw}:${JSON.stringify(parameters)}`)
	const filesGetURL = vi.fn((record: { file: string }, file: string, options?: object) => (options ? `https://example.com/thumb/${file}` : `https://example.com/full/${file}`))
	const files = { getUrl: filesGetURL }
	const pb = { collection, files, filter } as unknown as App.Locals['pb'] & PocketBase
	return { collection, filesGetURL, filter, getList, pb }
}

const mockRecord = {
	alt: 'Test image',
	caption: 'A caption',
	collectionId: 'col1',
	collectionName: 'media',
	file: 'test.jpg',
	height: 300,
	id: 'rec1',
	width: 400,
}

const mockResult = {
	items: [mockRecord],
	page: 1,
	perPage: 30,
	totalItems: 1,
	totalPages: 1,
}

describe('GET /api/cms/media', () => {
	test('non-editor → 403', async () => {
		const event = createEvent({ user: { role: 'viewer' } } as Partial<Locals>, '')

		const response = await GET(event)

		expect(response.status).toBe(403)
	})

	test('no user → 403', async () => {
		const event = createEvent({} as Partial<Locals>, '')

		const response = await GET(event)

		expect(response.status).toBe(403)
	})

	test('editor + no query → 200 と { items, page, totalPages } の JSON を返す', async () => {
		const { pb } = createMocks(mockResult)
		const event = createEvent({ pb, user: { role: 'editor' } } as Partial<Locals>, '')

		const response = await GET(event)

		expect(response.status).toBe(200)
		const body = await response.json()
		expect(body).toMatchObject({ page: 1, totalPages: 1 })
		expect(body.items).toHaveLength(1)
		expect(body.items[0]).toMatchObject({ alt: 'Test image', id: 'rec1' })
		expect(body.items[0].src).toBeDefined()
		expect(body.items[0].thumbUrl).toBeDefined()
	})

	test('editor + no query → getList が filter なしで呼ばれる', async () => {
		const { getList, pb } = createMocks(mockResult)
		const event = createEvent({ pb, user: { role: 'editor' } } as Partial<Locals>, '')

		await GET(event)

		expect(getList).toHaveBeenCalledWith(1, 30, { sort: '-created' })
	})

	test('?q=temple → pb.filter が検索フィルター文字列で呼ばれる', async () => {
		const { filter, pb } = createMocks(mockResult)
		const event = createEvent({ pb, user: { role: 'editor' } } as Partial<Locals>, '?q=temple')

		await GET(event)

		expect(filter).toHaveBeenCalledWith('file ~ {:q} || alt ~ {:q} || caption ~ {:q}', { q: 'temple' })
	})

	test('?q=temple → getList が filter 付きで呼ばれる', async () => {
		const { getList, pb } = createMocks(mockResult)
		const event = createEvent({ pb, user: { role: 'editor' } } as Partial<Locals>, '?q=temple')

		await GET(event)

		const callArguments = getList.mock.calls[0]
		expect(callArguments[2]).toMatchObject({ sort: '-created' })
		expect(callArguments[2].filter).toBeDefined()
	})
})
