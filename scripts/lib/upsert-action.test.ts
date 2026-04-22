import { describe, expect, test } from 'vitest'

import { resolveUpsertAction } from './upsert-action'

// Red: Green 実装 (daana-ov9.7 / daana-ov9.8) 完了までは全件失敗する想定。
describe('resolveUpsertAction (daana-u92 Red → daana-ov9.7/ov9.8 Green)', () => {
	test('existing を省略 → action: create', () => {
		const result = resolveUpsertAction('news-001')
		expect(result).toEqual({ type: 'create' })
	})

	test('existing.originalId が一致 → action: update, id は existing.id', () => {
		const existing = { id: 'abcd1234', originalId: 'news-001' }
		const result = resolveUpsertAction('news-001', existing)
		expect(result).toEqual({ id: 'abcd1234', type: 'update' })
	})

	test('existing.originalId が不一致 → 例外を投げる (キー衝突の防護)', () => {
		const existing = { id: 'abcd1234', originalId: 'news-999' }
		expect(() => resolveUpsertAction('news-001', existing)).toThrow(/originalId/i)
	})

	test('同じ入力で2回呼んでも結果が等しい (純粋性)', () => {
		const existing = { id: 'abcd1234', originalId: 'news-001' }
		const first = resolveUpsertAction('news-001', existing)
		const second = resolveUpsertAction('news-001', existing)
		expect(first).toEqual(second)
	})

	test('existing を省略した場合、同じ入力は常に create', () => {
		expect(resolveUpsertAction('news-001')).toEqual({ type: 'create' })
		expect(resolveUpsertAction('news-001')).toEqual({ type: 'create' })
	})
})
