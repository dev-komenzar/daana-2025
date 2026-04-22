import { describe, expect, test } from 'vitest'

import { shouldShowNav } from './nav-utilities'

describe('shouldShowNav', () => {
	test('editor on /cms → shows nav', () => {
		expect(shouldShowNav('/cms', 'editor')).toBe(true)
	})

	test('editor on /cms/news → shows nav', () => {
		expect(shouldShowNav('/cms/news', 'editor')).toBe(true)
	})

	test('editor on /cms/projects → shows nav', () => {
		expect(shouldShowNav('/cms/projects', 'editor')).toBe(true)
	})

	test('editor on /cms/media → shows nav', () => {
		expect(shouldShowNav('/cms/media', 'editor')).toBe(true)
	})

	test('editor on /cms/login → does NOT show nav', () => {
		expect(shouldShowNav('/cms/login', 'editor')).toBe(false)
	})

	test('null user on /cms → does NOT show nav', () => {
		// eslint-disable-next-line unicorn/no-null -- testing null user (unauthenticated)
		expect(shouldShowNav('/cms', null)).toBe(false)
	})

	test('non-editor role on /cms → does NOT show nav', () => {
		expect(shouldShowNav('/cms', 'viewer')).toBe(false)
	})
})
