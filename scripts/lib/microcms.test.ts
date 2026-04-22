import { http, HttpResponse } from 'msw'
import { describe, expect, test } from 'vitest'

import { server, setupMswServer } from '../test-utils/msw-server'
import { createMicrocmsClient, fetchAllContents, fetchAllNews, fetchAllProjects } from './microcms'

setupMswServer()

const MICROCMS_BASE = 'https://samgha.microcms.io/api/v1'

describe('fetchAllContents (daana-ov9.2 / ov9.3)', () => {
	test('totalCount を超えるまで pagination を繰り返し、全件結合する', async () => {
		const total = 25
		const items = Array.from({ length: total }, (_, i) => ({ id: `item-${i}` }))
		server.use(
			http.get(`${MICROCMS_BASE}/news`, ({ request }) => {
				const url = new URL(request.url)
				const limit = Number(url.searchParams.get('limit') ?? '10')
				const offset = Number(url.searchParams.get('offset') ?? '0')
				const page = items.slice(offset, offset + limit)
				return HttpResponse.json({
					contents: page,
					limit,
					offset,
					totalCount: total,
				})
			}),
		)

		const client = createMicrocmsClient({ apiKey: 'test' })
		const result = await fetchAllContents<{ id: string }>(client, 'news', { pageSize: 10 })

		expect(result).toHaveLength(25)
		expect(result[0]?.id).toBe('item-0')
		expect(result.at(-1)?.id).toBe('item-24')
	})

	test('1ページで収まる場合は1リクエストで完了する', async () => {
		let calls = 0
		server.use(
			http.get(`${MICROCMS_BASE}/news`, () => {
				calls += 1
				return HttpResponse.json({ contents: [{ id: 'a' }, { id: 'b' }], limit: 100, offset: 0, totalCount: 2 })
			}),
		)
		const client = createMicrocmsClient({ apiKey: 'test' })
		const result = await fetchAllContents<{ id: string }>(client, 'news', { pageSize: 100 })

		expect(result).toHaveLength(2)
		expect(calls).toBe(1)
	})

	test('空レスポンスでも例外を投げず空配列を返す', async () => {
		server.use(http.get(`${MICROCMS_BASE}/news`, () => HttpResponse.json({ contents: [], limit: 100, offset: 0, totalCount: 0 })))
		const client = createMicrocmsClient({ apiKey: 'test' })
		const result = await fetchAllContents<{ id: string }>(client, 'news', { pageSize: 100 })

		expect(result).toEqual([])
	})

	test('fields オプションはクエリに反映される', async () => {
		let receivedFields: string | undefined
		server.use(
			http.get(`${MICROCMS_BASE}/news`, ({ request }) => {
				receivedFields = new URL(request.url).searchParams.get('fields') ?? undefined
				return HttpResponse.json({ contents: [], limit: 100, offset: 0, totalCount: 0 })
			}),
		)
		const client = createMicrocmsClient({ apiKey: 'test' })
		await fetchAllContents(client, 'news', { fields: ['id', 'title'] })

		expect(receivedFields).toBe('id,title')
	})

	test('apiKey なしでクライアント生成は例外', () => {
		expect(() => createMicrocmsClient({ apiKey: '' })).toThrow(/apiKey/)
	})

	test('pageSize <= 0 は例外', async () => {
		const client = createMicrocmsClient({ apiKey: 'test' })
		await expect(fetchAllContents(client, 'news', { pageSize: 0 })).rejects.toThrow(/pageSize/)
	})
})

describe('fetchAllNews / fetchAllProjects (daana-ov9.2 / ov9.3 一貫性)', () => {
	test('fetchAllNews は default fixture の 2 件を取得できる', async () => {
		const client = createMicrocmsClient({ apiKey: 'test' })
		const result = await fetchAllNews(client)
		expect(result).toHaveLength(2)
		expect(result.map(n => n.id)).toEqual(['news-001', 'news-002'])
	})

	test('fetchAllProjects は default fixture の 1 件を取得できる', async () => {
		const client = createMicrocmsClient({ apiKey: 'test' })
		const result = await fetchAllProjects(client)
		expect(result).toHaveLength(1)
		expect(result[0]?.id).toBe('proj-001')
	})
})
