import { describe, expect, test } from 'vitest'

import { statusOf } from './status'

describe('statusOf', () => {
	test('draft: true → "draft"', () => {
		expect(statusOf({ draft: true, published_at: undefined })).toBe('draft')
	})

	test('draft: true with past published_at → "draft"', () => {
		expect(statusOf({ draft: true, published_at: '2020-01-01T00:00:00.000Z' }, new Date('2025-01-01T00:00:00.000Z'))).toBe('draft')
	})

	test('draft: false, published_at: undefined → "published"', () => {
		expect(statusOf({ draft: false, published_at: undefined })).toBe('published')
	})

	test('draft: false, past published_at → "published"', () => {
		expect(statusOf({ draft: false, published_at: '2020-01-01T00:00:00.000Z' }, new Date('2025-01-01T00:00:00.000Z'))).toBe('published')
	})

	test('draft: false, future published_at → "scheduled"', () => {
		expect(statusOf({ draft: false, published_at: '2030-01-01T00:00:00.000Z' }, new Date('2025-01-01T00:00:00.000Z'))).toBe('scheduled')
	})

	test('draft: undefined, published_at: undefined → "published"', () => {
		expect(statusOf({ draft: undefined, published_at: undefined })).toBe('published')
	})

	test('draft: undefined, future published_at → "scheduled"', () => {
		expect(statusOf({ draft: undefined, published_at: '2030-01-01T00:00:00.000Z' }, new Date('2025-01-01T00:00:00.000Z'))).toBe('scheduled')
	})

	test('invalid date string → "published" (fail-open)', () => {
		expect(statusOf({ draft: false, published_at: 'not-a-date' })).toBe('published')
	})
})
