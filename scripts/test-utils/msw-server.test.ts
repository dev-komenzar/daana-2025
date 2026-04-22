import { describe, expect, test } from 'vitest'

import { setupMswServer } from './msw-server'

describe('msw test infra (daana-6rw)', () => {
	setupMswServer()

	test('microCMS /news エンドポイントが fixture を返す', async () => {
		const response = await fetch('https://samgha.microcms.io/api/v1/news')
		expect(response.ok).toBe(true)

		const body = (await response.json()) as { contents: unknown[]; totalCount: number }
		expect(body.totalCount).toBeGreaterThan(0)
		expect(Array.isArray(body.contents)).toBe(true)
	})

	test('microCMS /projects エンドポイントが fixture を返す', async () => {
		const response = await fetch('https://samgha.microcms.io/api/v1/projects')
		expect(response.ok).toBe(true)

		const body = (await response.json()) as { contents: unknown[]; totalCount: number }
		expect(body.totalCount).toBeGreaterThan(0)
	})
})
