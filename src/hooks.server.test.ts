import type { Handle, RequestEvent } from '@sveltejs/kit'

import PocketBase from 'pocketbase'
import { describe, expect, test, vi } from 'vitest'

import { handle } from './hooks.server'

function createEvent(cookieHeader?: string): RequestEvent {
	const headers = new Headers()
	if (cookieHeader) headers.set('cookie', cookieHeader)
	return {
		locals: {} as App.Locals,
		request: new Request('http://localhost/anywhere', { headers }),
		url: new URL('http://localhost/anywhere'),
	} as unknown as RequestEvent
}

describe('hooks.server handle', () => {
	test('Cookie が無い場合、locals.pb が PocketBase インスタンス、locals.user は null', async () => {
		const event = createEvent()
		const resolve: Parameters<Handle>[0]['resolve'] = vi.fn(async () => new Response('ok'))

		await handle({ event, resolve })

		expect(event.locals.pb).toBeInstanceOf(PocketBase)
		expect(event.locals.user).toBeNull()
		expect(resolve).toHaveBeenCalledOnce()
	})

	test('Cookie が無い場合でも、レスポンスに Set-Cookie (pb_auth) が付与される', async () => {
		const event = createEvent()
		const resolve: Parameters<Handle>[0]['resolve'] = vi.fn(async () => new Response('ok'))

		const response = await handle({ event, resolve })

		const setCookie = response.headers.get('set-cookie')
		expect(setCookie).toMatch(/pb_auth=/)
	})

	test('不正な Cookie 形式でも locals.user は null でクラッシュしない', async () => {
		const event = createEvent('pb_auth=not-a-valid-jwt')
		const resolve: Parameters<Handle>[0]['resolve'] = vi.fn(async () => new Response('ok'))

		await handle({ event, resolve })

		expect(event.locals.user).toBeNull()
	})
})
