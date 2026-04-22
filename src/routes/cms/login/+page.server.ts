import { loginAction } from '$lib/cms/auth/login-action'
import { fail, redirect } from '@sveltejs/kit'

import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = ({ locals }) => {
	if (locals.user) redirect(303, '/cms')
}

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const data = await request.formData()
		const email = (data.get('email') ?? '').toString()
		const password = (data.get('password') ?? '').toString()

		const result = await loginAction(locals.pb, email, password)
		if (!result.ok) {
			return fail(result.status, { email, message: result.message })
		}
		redirect(303, '/cms')
	},
}
