/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, expect, test, vi } from 'vitest'

vi.mock('$env/static/private', () => ({
	CMS_SOURCE: 'microcms',
	MICROCMS_API_KEY: 'dummy-key',
	PB_URL: 'http://localhost:8090',
}))

import type { NewsItem } from '../domain/schema'

import { PocketBaseNewsRepository } from './pb-repository'

type CollectionStub = {
	getFirstListItem: ReturnType<typeof vi.fn>
	getList: ReturnType<typeof vi.fn>
	getOne: ReturnType<typeof vi.fn>
}

function createPbStub(collection: Partial<CollectionStub> = {}): { collection: (name: string) => CollectionStub; lastCollectionName: string | undefined } {
	let lastCollectionName: string | undefined
	const stub: CollectionStub = {
		getFirstListItem: vi.fn(),
		getList: vi.fn(),
		getOne: vi.fn(),
		...collection,
	}
	return {
		collection(name: string) {
			lastCollectionName = name
			return stub
		},
		get lastCollectionName() {
			return lastCollectionName
		},
	}
}

const PB_BASE = 'http://localhost:8090'

describe('PocketBaseNewsRepository', () => {
	describe('getNews', () => {
		test('offset/limit から page/perPage を計算し、公開フィルタ + published_at 降順で getList を呼ぶ', async () => {
			const pb = createPbStub({
				getList: vi.fn().mockResolvedValue({ items: [], page: 2, perPage: 10, totalItems: 0, totalPages: 0 }),
			})
			const repo = new PocketBaseNewsRepository(pb as any, PB_BASE)

			await repo.getNews(10, 10, ['id', 'title'])

			const getList = pb.collection('news').getList as ReturnType<typeof vi.fn>
			expect(getList).toHaveBeenCalledTimes(1)
			const [page, perPage, options] = getList.mock.calls[0]
			expect(page).toBe(2)
			expect(perPage).toBe(10)
			expect(options).toMatchObject({
				expand: 'thumbnail',
				filter: 'draft != true && (published_at = "" || published_at <= @now)',
				sort: '-published_at',
			})
		})

		test('PB レコードを NewsItem にマッピング (originalId, publishedAt ISO 変換, thumbnail 展開)', async () => {
			const pb = createPbStub({
				getList: vi.fn().mockResolvedValue({
					items: [
						{
							collectionId: 'col_news',
							collectionName: 'news',
							content: '<p>本文</p>',
							created: '2026-04-22 05:50:12.897Z',
							draft: false,
							expand: {
								thumbnail: {
									alt: 'サムネ',
									collectionId: 'col_media',
									collectionName: 'media',
									file: 'image_xxx.jpg',
									height: 900,
									id: 'mnbi3o3iqncivfa',
									width: 1600,
								},
							},
							id: '0gj3j64rnfz9c7k',
							original_id: '2inev7ar9',
							pinned: false,
							published_at: '2026-04-15 14:07:54.638Z',
							revised_at: '2026-04-15 14:07:54.638Z',
							thumbnail: 'mnbi3o3iqncivfa',
							title: 'テストタイトル',
							updated: '2026-04-22 05:50:37.016Z',
						},
					],
					page: 1,
					perPage: 10,
					totalItems: 1,
					totalPages: 1,
				}),
			})
			const repo = new PocketBaseNewsRepository(pb as any, PB_BASE)

			const result = await repo.getNews(0, 10, ['id', 'title', 'publishedAt', 'thumbnail', 'content'])

			expect(result).toHaveLength(1)
			const item = result[0] as NewsItem
			expect(item.id).toBe('0gj3j64rnfz9c7k')
			expect(item.originalId).toBe('2inev7ar9')
			expect(item.title).toBe('テストタイトル')
			expect(item.content).toBe('<p>本文</p>')
			expect(item.pinned).toBe(false)
			expect(item.draft).toBe(false)
			expect(item.publishedAt).toBe('2026-04-15T14:07:54.638Z')
			expect(item.revisedAt).toBe('2026-04-15T14:07:54.638Z')
			expect(item.createdAt).toBe('2026-04-22T05:50:12.897Z')
			expect(item.updatedAt).toBe('2026-04-22T05:50:37.016Z')
			expect(item.thumbnail).toEqual({
				height: 900,
				url: `${PB_BASE}/api/files/col_media/mnbi3o3iqncivfa/image_xxx.jpg`,
				width: 1600,
			})
		})

		test('エラー時は空配列を返す', async () => {
			const pb = createPbStub({
				getList: vi.fn().mockRejectedValue(new Error('network')),
			})
			const repo = new PocketBaseNewsRepository(pb as any, PB_BASE)
			const result = await repo.getNews(0, 10, ['id'])
			expect(result).toEqual([])
		})

		test('thumbnail が無いレコードは thumbnail を undefined にする', async () => {
			const pb = createPbStub({
				getList: vi.fn().mockResolvedValue({
					items: [
						{
							collectionId: 'col_news',
							collectionName: 'news',
							created: '2026-04-22 05:50:12.897Z',
							draft: false,
							id: 'abc',
							original_id: '',
							pinned: false,
							published_at: '2026-04-15 14:07:54.638Z',
							revised_at: '2026-04-15 14:07:54.638Z',
							thumbnail: '',
							title: 'No thumb',
							updated: '2026-04-22 05:50:12.897Z',
						},
					],
					page: 1,
					perPage: 10,
					totalItems: 1,
					totalPages: 1,
				}),
			})
			const repo = new PocketBaseNewsRepository(pb as any, PB_BASE)
			const [item] = await repo.getNews(0, 10, ['id', 'title'])
			expect(item.thumbnail).toBeUndefined()
			expect(item.originalId).toBeUndefined()
		})
	})

	describe('getNewsById', () => {
		test('PB getOne を thumbnail expand 付きで呼ぶ', async () => {
			const pb = createPbStub({
				getOne: vi.fn().mockResolvedValue({
					created: '2026-04-22 05:50:12.897Z',
					draft: false,
					id: 'abc',
					original_id: 'orig-1',
					pinned: false,
					published_at: '2026-04-15 14:07:54.638Z',
					revised_at: '2026-04-15 14:07:54.638Z',
					thumbnail: '',
					title: 't',
					updated: '2026-04-22 05:50:12.897Z',
				}),
			})
			const repo = new PocketBaseNewsRepository(pb as any, PB_BASE)
			const item = await repo.getNewsById('abc')
			const getOne = pb.collection('news').getOne as ReturnType<typeof vi.fn>
			expect(getOne).toHaveBeenCalledWith('abc', { expand: 'thumbnail' })
			expect(item?.id).toBe('abc')
			expect(item?.originalId).toBe('orig-1')
		})

		test('404 の場合 undefined', async () => {
			const notFoundError = Object.assign(new Error('not found'), { status: 404 })
			const pb = createPbStub({
				getOne: vi.fn().mockRejectedValue(notFoundError),
			})
			const repo = new PocketBaseNewsRepository(pb as any, PB_BASE)
			const item = await repo.getNewsById('missing')
			expect(item).toBeUndefined()
		})

		test('draft: true のレコードは undefined を返す (可視性チェック)', async () => {
			const pb = createPbStub({
				getOne: vi.fn().mockResolvedValue({
					created: '2026-04-22 05:50:12.897Z',
					draft: true,
					id: 'abc',
					original_id: '',
					pinned: false,
					published_at: '2020-01-01 00:00:00.000Z',
					revised_at: '',
					thumbnail: '',
					title: '下書き',
					updated: '2026-04-22 05:50:12.897Z',
				}),
			})
			const repo = new PocketBaseNewsRepository(pb as any, PB_BASE)
			const item = await repo.getNewsById('abc')
			expect(item).toBeUndefined()
		})

		test('未来の published_at (予約公開) のレコードは undefined を返す', async () => {
			const pb = createPbStub({
				getOne: vi.fn().mockResolvedValue({
					created: '2020-01-01 00:00:00.000Z',
					draft: false,
					id: 'abc',
					original_id: '',
					pinned: false,
					published_at: '2099-01-01 00:00:00.000Z',
					revised_at: '',
					thumbnail: '',
					title: '予約',
					updated: '2020-01-01 00:00:00.000Z',
				}),
			})
			const repo = new PocketBaseNewsRepository(pb as any, PB_BASE)
			const item = await repo.getNewsById('abc')
			expect(item).toBeUndefined()
		})
	})

	describe('getPinnedNews', () => {
		test('pinned=true + 公開フィルタで getList を呼ぶ', async () => {
			const pb = createPbStub({
				getList: vi.fn().mockResolvedValue({ items: [], page: 1, perPage: 5, totalItems: 0, totalPages: 0 }),
			})
			const repo = new PocketBaseNewsRepository(pb as any, PB_BASE)
			await repo.getPinnedNews(5, ['id', 'title', 'pinned'])

			const getList = pb.collection('news').getList as ReturnType<typeof vi.fn>
			expect(getList).toHaveBeenCalledTimes(1)
			const [page, perPage, options] = getList.mock.calls[0]
			expect(page).toBe(1)
			expect(perPage).toBe(5)
			expect(options).toMatchObject({
				expand: 'thumbnail',
				filter: 'pinned=true && draft != true && (published_at = "" || published_at <= @now)',
				sort: '-published_at',
			})
		})
	})

	describe('getTotalCount', () => {
		test('totalItems を返す', async () => {
			const pb = createPbStub({
				getList: vi.fn().mockResolvedValue({ items: [], page: 1, perPage: 1, totalItems: 42, totalPages: 42 }),
			})
			const repo = new PocketBaseNewsRepository(pb as any, PB_BASE)
			const count = await repo.getTotalCount()
			expect(count).toBe(42)
		})

		test('エラー時は 0 を返す', async () => {
			const pb = createPbStub({
				getList: vi.fn().mockRejectedValue(new Error('x')),
			})
			const repo = new PocketBaseNewsRepository(pb as any, PB_BASE)
			const count = await repo.getTotalCount()
			expect(count).toBe(0)
		})
	})

	describe('getNewsByOriginalId', () => {
		test('original_id フィルタで getFirstListItem を呼び NewsItem を返す', async () => {
			const pb = createPbStub({
				getFirstListItem: vi.fn().mockResolvedValue({
					created: '2026-04-22 05:50:12.897Z',
					draft: false,
					id: 'pb-id-xxx',
					original_id: 'old-micro-1',
					pinned: false,
					published_at: '2026-04-15 14:07:54.638Z',
					revised_at: '2026-04-15 14:07:54.638Z',
					thumbnail: '',
					title: 't',
					updated: '2026-04-22 05:50:12.897Z',
				}),
			})
			const repo = new PocketBaseNewsRepository(pb as any, PB_BASE)
			const item = await repo.getNewsByOriginalId('old-micro-1')

			const function_ = pb.collection('news').getFirstListItem as ReturnType<typeof vi.fn>
			expect(function_).toHaveBeenCalledWith('original_id="old-micro-1"', { expand: 'thumbnail' })
			expect(item?.id).toBe('pb-id-xxx')
		})

		test('404 の場合 undefined', async () => {
			const notFound = Object.assign(new Error('not found'), { status: 404 })
			const pb = createPbStub({
				getFirstListItem: vi.fn().mockRejectedValue(notFound),
			})
			const repo = new PocketBaseNewsRepository(pb as any, PB_BASE)
			const item = await repo.getNewsByOriginalId('missing')
			expect(item).toBeUndefined()
		})

		test('draft: true のレコードは undefined を返す (可視性チェック)', async () => {
			const pb = createPbStub({
				getFirstListItem: vi.fn().mockResolvedValue({
					created: '2020-01-01 00:00:00.000Z',
					draft: true,
					id: 'abc',
					original_id: 'old-1',
					pinned: false,
					published_at: '2020-01-01 00:00:00.000Z',
					revised_at: '',
					thumbnail: '',
					title: '下書き',
					updated: '2020-01-01 00:00:00.000Z',
				}),
			})
			const repo = new PocketBaseNewsRepository(pb as any, PB_BASE)
			const item = await repo.getNewsByOriginalId('old-1')
			expect(item).toBeUndefined()
		})

		test('ダブルクォート混じりの originalId をエスケープする', async () => {
			const pb = createPbStub({
				getFirstListItem: vi.fn().mockResolvedValue({
					created: '2026-04-22 05:50:12.897Z',
					draft: false,
					id: 'abc',
					original_id: 'weird"id',
					pinned: false,
					published_at: '2026-04-15 14:07:54.638Z',
					revised_at: '2026-04-15 14:07:54.638Z',
					thumbnail: '',
					title: 't',
					updated: '2026-04-22 05:50:12.897Z',
				}),
			})
			const repo = new PocketBaseNewsRepository(pb as any, PB_BASE)
			await repo.getNewsByOriginalId('weird"id')
			const function_ = pb.collection('news').getFirstListItem as ReturnType<typeof vi.fn>
			expect(function_).toHaveBeenCalledWith(String.raw`original_id="weird\"id"`, { expand: 'thumbnail' })
		})
	})
})
