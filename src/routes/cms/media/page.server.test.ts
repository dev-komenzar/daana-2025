import type PocketBase from 'pocketbase'

import { describe, expect, test, vi } from 'vitest'

import { load } from './+page.server'

function createEvent(pb: App.Locals['pb'], search: string): Parameters<typeof load>[0] {
	return {
		locals: { pb } as App.Locals,
		url: new URL(`http://localhost/cms/media${search}`),
	} as unknown as Parameters<typeof load>[0]
}

function createMocks(result: object) {
	const getList = vi.fn().mockResolvedValue(result)
	const collection = vi.fn(() => ({ getList }))
	const filter = vi.fn((raw: string, parameters: Record<string, unknown>) => `interpolated:${raw}:${JSON.stringify(parameters)}`)
	const filesGetURL = vi.fn(() => 'https://example.com/thumb.jpg')
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
	mime: 'image/jpeg',
	width: 400,
}

const mockResult = {
	items: [mockRecord],
	page: 1,
	perPage: 30,
	totalItems: 1,
	totalPages: 1,
}

describe('cms/media +page.server load', () => {
	test("クエリなし → getList(1, 30, { sort: '-created' }) が呼ばれ、filter なし", async () => {
		const { collection, getList, pb } = createMocks(mockResult)
		const event = createEvent(pb, '')

		const data = await load(event)

		expect(collection).toHaveBeenCalledWith('media')
		expect(getList).toHaveBeenCalledWith(1, 30, { sort: '-created' })
		expect(data).toMatchObject({ page: 1, perPage: 30, q: '', totalPages: 1 })
		expect((data as { items: unknown[] }).items).toHaveLength(1)
	})

	test('?page=2 → getList(2, 30, ...) が呼ばれる', async () => {
		const result2 = { ...mockResult, page: 2, totalPages: 3 }
		const { getList, pb } = createMocks(result2)
		const event = createEvent(pb, '?page=2')

		await load(event)

		expect(getList).toHaveBeenCalledWith(2, 30, { sort: '-created' })
	})

	test('?q=temple → filter 付きで getList が呼ばれ、pb.filter が使われる', async () => {
		const { filter, getList, pb } = createMocks(mockResult)
		const event = createEvent(pb, '?q=temple')

		await load(event)

		expect(filter).toHaveBeenCalledWith('file ~ {:q} || alt ~ {:q} || caption ~ {:q}', { q: 'temple' })
		const callArguments = getList.mock.calls[0]
		expect(callArguments[0]).toBe(1)
		expect(callArguments[1]).toBe(30)
		expect(callArguments[2]).toMatchObject({ sort: '-created' })
		expect(callArguments[2].filter).toBeDefined()
	})

	test('空の ?q= → filter なし (trim で空文字扱い)', async () => {
		const { filter, getList, pb } = createMocks(mockResult)
		const event = createEvent(pb, '?q=')

		await load(event)

		expect(filter).not.toHaveBeenCalled()
		expect(getList).toHaveBeenCalledWith(1, 30, { sort: '-created' })
	})

	test('?page=abc → page 1 にフォールバック', async () => {
		const { getList, pb } = createMocks(mockResult)
		const event = createEvent(pb, '?page=abc')

		await load(event)

		expect(getList).toHaveBeenCalledWith(1, 30, { sort: '-created' })
	})

	test('data.items に thumbUrl が含まれる', async () => {
		const { filesGetURL, pb } = createMocks(mockResult)
		const event = createEvent(pb, '')

		const data = await load(event)

		expect(filesGetURL).toHaveBeenCalledWith(expect.objectContaining({ id: 'rec1' }), 'test.jpg', { thumb: '200x200' })
		const items = (data as { items: Array<{ alt: string; fileName: string; thumbUrl: string }> }).items
		expect(items[0].thumbUrl).toBe('https://example.com/thumb.jpg')
		expect(items[0].alt).toBe('Test image')
		expect(items[0].fileName).toBe('test.jpg')
	})

	test('q が data に含まれる', async () => {
		const { pb } = createMocks(mockResult)
		const event = createEvent(pb, '?q=temple')

		const data = await load(event)

		expect((data as { q: string }).q).toBe('temple')
	})
})
