import { redirect } from '@sveltejs/kit'

import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({ locals, url }) => {
	if (url.pathname === '/cms/login') {
		return { user: locals.user }
	}

	if (locals.user?.role !== 'editor') {
		redirect(303, '/cms/login')
	}

	return { user: locals.user }
}
