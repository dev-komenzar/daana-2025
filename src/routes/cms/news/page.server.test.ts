import { describe, expect, test, vi } from 'vitest'

import { load } from './+page.server'

function createEvent(pb: App.Locals['pb'], search: string): Parameters<typeof load>[0] {
	return {
		locals: { pb } as App.Locals,
		url: new URL(`http://localhost/cms/news${search}`),
	} as unknown as Parameters<typeof load>[0]
}

function createMocks(result: object) {
	const getList = vi.fn().mockResolvedValue(result)
	const collection = vi.fn(() => ({ getList }))
	const pb = { collection } as unknown as App.Locals['pb']
	return { collection, getList, pb }
}

const mockResult = {
	items: [{ draft: false, id: 'abc', pinned: false, published_at: '2025-01-01 00:00:00.000Z', title: 'Test' }],
	page: 1,
	perPage: 20,
	totalItems: 1,
	totalPages: 1,
}

describe('cms/news +page.server load', () => {
	test('happy path: ?page=2 → getList(2, 20, ...) が呼ばれ data が返る', async () => {
		const result2 = { ...mockResult, page: 2, totalPages: 3 }
		const { collection, getList, pb } = createMocks(result2)
		const event = createEvent(pb, '?page=2')

		const data = await load(event)

		expect(collection).toHaveBeenCalledWith('news')
		expect(getList).toHaveBeenCalledWith(2, 20, { sort: '-published_at' })
		expect(data).toMatchObject({ page: 2, perPage: 20, totalPages: 3 })
		expect((data as { items: unknown[] }).items).toHaveLength(1)
	})

	test('デフォルトページ: page クエリなし → getList(1, 20, ...) が呼ばれる', async () => {
		const { getList, pb } = createMocks(mockResult)
		const event = createEvent(pb, '')

		await load(event)

		expect(getList).toHaveBeenCalledWith(1, 20, { sort: '-published_at' })
	})

	test('不正な page クエリ ?page=abc → page 1 にフォールバック', async () => {
		const { getList, pb } = createMocks(mockResult)
		const event = createEvent(pb, '?page=abc')

		await load(event)

		expect(getList).toHaveBeenCalledWith(1, 20, { sort: '-published_at' })
	})

	test('?page=0 → page 1 にフォールバック', async () => {
		const { getList, pb } = createMocks(mockResult)
		const event = createEvent(pb, '?page=0')

		await load(event)

		expect(getList).toHaveBeenCalledWith(1, 20, { sort: '-published_at' })
	})
})
