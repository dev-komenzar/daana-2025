import type { Handle } from '@sveltejs/kit'

import consola from 'consola'
import PocketBase from 'pocketbase'

export const handle: Handle = async ({ event, resolve }) => {
	const pb = new PocketBase(process.env.PB_URL ?? 'http://localhost:8090')
	pb.authStore.loadFromCookie(event.request.headers.get('cookie') ?? '')

	try {
		if (pb.authStore.isValid) {
			await pb.collection('users').authRefresh()
		}
	} catch (error) {
		consola.warn('[hooks.server] authRefresh failed, clearing auth', error)
		pb.authStore.clear()
	}

	event.locals.pb = pb
	event.locals.user = pb.authStore.model

	const response = await resolve(event)

	response.headers.append(
		'set-cookie',
		pb.authStore.exportToCookie({
			httpOnly: true,
			path: '/',
			sameSite: 'lax',
			secure: event.url.protocol === 'https:',
		}),
	)

	return response
}
