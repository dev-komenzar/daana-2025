import { describe, expect, test } from 'vitest'

import { isPubliclyVisible } from './visibility'

describe('isPubliclyVisible', () => {
	test('draft: true → false (always hidden)', () => {
		expect(isPubliclyVisible({ draft: true, publishedAt: undefined })).toBe(false)
	})

	test('draft: true with past publishedAt → still false', () => {
		expect(isPubliclyVisible({ draft: true, publishedAt: '2020-01-01T00:00:00.000Z' }, new Date('2025-01-01T00:00:00.000Z'))).toBe(false)
	})

	test('draft: false, publishedAt: undefined → true (legacy/unscheduled)', () => {
		expect(isPubliclyVisible({ draft: false, publishedAt: undefined })).toBe(true)
	})

	test('draft: false, past publishedAt → true', () => {
		expect(isPubliclyVisible({ draft: false, publishedAt: '2020-01-01T00:00:00.000Z' }, new Date('2025-01-01T00:00:00.000Z'))).toBe(true)
	})

	test('draft: false, future publishedAt → false (scheduled)', () => {
		expect(isPubliclyVisible({ draft: false, publishedAt: '2030-01-01T00:00:00.000Z' }, new Date('2025-01-01T00:00:00.000Z'))).toBe(false)
	})

	test('invalid date string → true (fail-open; do not hide due to bad data)', () => {
		expect(isPubliclyVisible({ draft: false, publishedAt: 'not-a-date' })).toBe(true)
	})

	test('draft: undefined, past publishedAt → true (no draft flag means published)', () => {
		expect(isPubliclyVisible({ draft: undefined, publishedAt: '2020-01-01T00:00:00.000Z' }, new Date('2025-01-01T00:00:00.000Z'))).toBe(true)
	})

	test('draft: undefined, publishedAt: undefined → true', () => {
		expect(isPubliclyVisible({ draft: undefined, publishedAt: undefined })).toBe(true)
	})

	test('publishedAt exactly equals now → true (boundary: published)', () => {
		const now = new Date('2025-06-01T12:00:00.000Z')
		expect(isPubliclyVisible({ draft: false, publishedAt: '2025-06-01T12:00:00.000Z' }, now)).toBe(true)
	})
})
