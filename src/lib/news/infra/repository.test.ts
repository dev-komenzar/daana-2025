/* eslint-disable @typescript-eslint/no-explicit-any */

import * as v from 'valibot'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

vi.mock('$env/static/private', () => ({
	MICROCMS_API_KEY: 'dummy-key',
}))

import type { MockInstance } from 'vitest'

import type { NewsItem, ReturnNewApi } from '../domain/schema'

import { NewsItemSchema } from '../domain/schema'
import { api } from './client'
import { newsRepository } from './repository'

// =================================================================
// 1. Unit Tests (using mock)
// =================================================================

describe('newsRepository (Unit)', () => {
	let spy: MockInstance

	beforeEach(() => {
		spy = vi.spyOn(api, 'get')
	})

	afterEach(() => {
		spy.mockRestore()
	})

	describe('getNews', () => {
		test('引数に基づいて正しいURLが生成され、APIが呼び出されること', async () => {
			const mockResponse: ReturnNewApi = {
				contents: [],
				limit: 10,
				offset: 5,
				totalCount: 0,
			}
			spy.mockReturnValue({
				json: () => Promise.resolve(mockResponse),
			} as any)

			const offset = 5
			const limit = 10
			const fields: (keyof NewsItem)[] = ['id', 'title']

			await newsRepository.getNews(offset, limit, fields)

			const expectedUrl = 'news?offset=5&limit=10&fields=id,title'
			expect(spy).toHaveBeenCalledWith(expectedUrl, undefined)
		})

		test('APIから取得したニュース記事の contents 配列を返すこと', async () => {
			const mockResponse: ReturnNewApi = {
				contents: [
					v.parse(NewsItemSchema, {
						content: '<p>本文1</p>',
						createdAt: '2023-06-30T00:00:00.000Z',
						id: 'news-1',
						pinned: false,
						publishedAt: '2023-06-30T00:00:00.000Z',
						revisedAt: '2023-06-30T00:00:00.000Z',
						thumbnail: { height: 100, url: 'https://example.com/thumb1.png', width: 100 },
						title: 'テストニュース1',
						updatedAt: '2023-06-30T00:00:00.000Z',
					}),
				],
				limit: 10,
				offset: 0,
				totalCount: 1,
			}

			spy.mockReturnValue({
				json: (): Promise<ReturnNewApi> => Promise.resolve(mockResponse),
			} as any)

			const news = await newsRepository.getNews(0, 10, ['id', 'title'])

			expect(news).toEqual(mockResponse.contents)
		})

		test('API通信が失敗した場合、空配列を返すこと', async () => {
			const mockError = new Error('API Error')
			spy.mockReturnValue({
				json: () => Promise.reject(mockError),
			} as any)

			const result = await newsRepository.getNews(0, 10, ['id'])
			expect(result).toEqual([])
		})
	})

	describe('getPinnedNews', () => {
		test('pinned=trueフィルタでAPIが呼び出されること', async () => {
			const mockResponse: ReturnNewApi = {
				contents: [
					v.parse(NewsItemSchema, {
						id: 'pinned-1',
						pinned: true,
						title: 'ピン留めニュース',
					}),
				],
				limit: 5,
				offset: 0,
				totalCount: 1,
			}
			spy.mockReturnValue({
				json: () => Promise.resolve(mockResponse),
			} as any)

			const result = await newsRepository.getPinnedNews(5, ['id', 'title', 'pinned'])

			expect(spy).toHaveBeenCalledWith('news?limit=5&fields=id,title,pinned&filters=pinned[equals]true', undefined)
			expect(result).toHaveLength(1)
			expect(result[0].pinned).toBe(true)
		})

		test('API通信が失敗した場合、空配列を返すこと', async () => {
			const mockError = new Error('API Error')
			spy.mockReturnValue({
				json: () => Promise.reject(mockError),
			} as any)

			const result = await newsRepository.getPinnedNews(5, ['id'])
			expect(result).toEqual([])
		})
	})
})

// =================================================================
// 2. Integration Tests (calling actual API)
// =================================================================

const hasApiKey = process.env.MICROCMS_API_KEY !== undefined
const isIntegrationTest = process.env.TEST_INTEGRATION === 'true'

describe.skipIf(!isIntegrationTest || !hasApiKey)('newsRepository (Integration)', () => {
	test('実際のAPIからNewsItemの配列を取得し、スキーマが一致すること', async () => {
		vi.setConfig({ testTimeout: 10_000 })

		let result: NewsItem[] | undefined
		let error: Error | undefined

		try {
			result = await newsRepository.getNews(0, 3, ['id', 'title', 'publishedAt'])
		} catch (error_) {
			error = error_ as Error
		}

		expect(error).toBeUndefined()
		expect(Array.isArray(result)).toBe(true)

		const schema = v.array(
			v.object({
				id: v.string(),
				publishedAt: v.pipe(v.string(), v.isoTimestamp()),
				title: v.string(),
			}),
		)
		expect(v.safeParse(schema, result).success).toBe(true)
	})
})
