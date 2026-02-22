import * as v from 'valibot'
import { describe, expect, test } from 'vitest'

import { NewsItemSchema, ReturnNewApiSchema } from './schema'

describe('NewsItemSchema', () => {
	test('必須フィールド id のみで有効', () => {
		const data = { id: 'news-1' }
		const result = v.safeParse(NewsItemSchema, data)
		expect(result.success).toBe(true)
	})

	test('全フィールドが正しくパースされる', () => {
		const data = {
			content: '<p>本文</p>',
			createdAt: '2023-06-30T00:00:00.000Z',
			id: 'news-1',
			pinned: true,
			publishedAt: '2023-06-30T00:00:00.000Z',
			revisedAt: '2023-06-30T00:00:00.000Z',
			thumbnail: { height: 100, url: 'https://example.com/thumb.png', width: 200 },
			title: 'テストニュース',
			updatedAt: '2023-06-30T00:00:00.000Z',
		}
		const result = v.safeParse(NewsItemSchema, data)
		expect(result.success).toBe(true)
		if (result.success) {
			expect(result.output.id).toBe('news-1')
			expect(result.output.pinned).toBe(true)
			expect(result.output.title).toBe('テストニュース')
		}
	})

	test('id が存在しない場合はエラー', () => {
		const data = { title: 'タイトルのみ' }
		const result = v.safeParse(NewsItemSchema, data)
		expect(result.success).toBe(false)
	})

	test('不正なタイムスタンプはエラー', () => {
		const data = {
			id: 'news-1',
			publishedAt: 'invalid-date',
		}
		const result = v.safeParse(NewsItemSchema, data)
		expect(result.success).toBe(false)
	})
})

describe('ReturnNewApiSchema', () => {
	test('有効なAPIレスポンスがパースされる', () => {
		const data = {
			contents: [{ id: 'news-1' }, { id: 'news-2' }],
			limit: 10,
			offset: 0,
			totalCount: 2,
		}
		const result = v.safeParse(ReturnNewApiSchema, data)
		expect(result.success).toBe(true)
		if (result.success) {
			expect(result.output.contents).toHaveLength(2)
			expect(result.output.totalCount).toBe(2)
		}
	})

	test('空の contents 配列も有効', () => {
		const data = {
			contents: [],
			limit: 10,
			offset: 0,
			totalCount: 0,
		}
		const result = v.safeParse(ReturnNewApiSchema, data)
		expect(result.success).toBe(true)
	})
})
