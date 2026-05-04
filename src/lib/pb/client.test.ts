import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

vi.mock('$env/dynamic/private', () => ({
	env: process.env,
}))

describe('buildPbFileUrl', () => {
	beforeEach(() => {
		vi.resetModules()
	})

	afterEach(() => {
		vi.unstubAllEnvs()
	})

	test('thumb 無しで PB_PUBLIC_URL/api/files/{col}/{id}/{file} を返す', async () => {
		vi.stubEnv('PB_URL', 'http://internal:8090')
		vi.stubEnv('PB_PUBLIC_URL', 'https://pb.example.com')

		const { buildPbFileUrl } = await import('./client')

		expect(buildPbFileUrl('news', 'rec1', 'cover.png')).toBe('https://pb.example.com/api/files/news/rec1/cover.png')
	})

	test('thumb 指定で末尾に ?thumb=200x200 が付く', async () => {
		vi.stubEnv('PB_URL', 'http://internal:8090')
		vi.stubEnv('PB_PUBLIC_URL', 'https://pb.example.com')

		const { buildPbFileUrl } = await import('./client')

		expect(buildPbFileUrl('news', 'rec1', 'cover.png', { thumb: '200x200' })).toBe('https://pb.example.com/api/files/news/rec1/cover.png?thumb=200x200')
	})

	test('PB_PUBLIC_URL が未設定の場合は PB_URL ベースになる', async () => {
		vi.stubEnv('PB_URL', 'http://internal:8090')
		vi.stubEnv('PB_PUBLIC_URL', '')

		const { buildPbFileUrl } = await import('./client')

		expect(buildPbFileUrl('news', 'rec1', 'cover.png')).toBe('http://internal:8090/api/files/news/rec1/cover.png')
	})

	test('PB_PUBLIC_URL が PB_URL と異なる時は必ず PB_PUBLIC_URL ベースになる', async () => {
		vi.stubEnv('PB_URL', 'http://internal:8090')
		vi.stubEnv('PB_PUBLIC_URL', 'https://public.example.com')

		const { buildPbFileUrl } = await import('./client')

		const url = buildPbFileUrl('news', 'rec1', 'cover.png', { thumb: '300x0' })
		expect(url).toBe('https://public.example.com/api/files/news/rec1/cover.png?thumb=300x0')
		expect(url.includes('internal:8090')).toBe(false)
	})
})
