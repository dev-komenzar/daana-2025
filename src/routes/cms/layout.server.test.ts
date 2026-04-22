import type { AuthModel } from 'pocketbase'

import { describe, expect, test } from 'vitest'

import { load } from './+layout.server'

type MinimalEvent = Parameters<typeof load>[0]

// eslint-disable-next-line unicorn/no-null -- PocketBase authStore.model returns null for unauth
const UNAUTH: AuthModel = null

function createEvent(pathname: string, user: AuthModel): MinimalEvent {
	return {
		locals: { user } as App.Locals,
		url: new URL(`http://localhost${pathname}`),
	} as unknown as MinimalEvent
}

describe('cms layout server load (auth guard)', () => {
	test('Case A: unauthenticated on /cms/news → redirects 303 to /cms/login', async () => {
		const event = createEvent('/cms/news', UNAUTH)
		await expect(load(event)).rejects.toMatchObject({ location: '/cms/login', status: 303 })
	})

	test('Case B: non-editor role on /cms/news → redirects 303 to /cms/login', async () => {
		const event = createEvent('/cms/news', { role: 'viewer' } as unknown as AuthModel)
		await expect(load(event)).rejects.toMatchObject({ location: '/cms/login', status: 303 })
	})

	test('Case C: authenticated editor on /cms/news → returns user without redirecting', async () => {
		const user = { role: 'editor' } as unknown as AuthModel
		const event = createEvent('/cms/news', user)
		const result = await load(event)
		expect(result).toEqual({ user })
	})

	test('Case D: unauthenticated on /cms/login → returns without redirecting', async () => {
		const event = createEvent('/cms/login', UNAUTH)
		await expect(load(event)).resolves.toEqual({ user: UNAUTH })
	})
})
