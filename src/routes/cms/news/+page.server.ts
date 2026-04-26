import { fail, redirect } from '@sveltejs/kit'

import type { Actions, PageServerLoad } from './$types'

type NewsListRecord = {
	draft?: boolean
	id: string
	pinned?: boolean
	published_at?: string
	title?: string
	updated?: string
}

export const load: PageServerLoad = async ({ locals, url }) => {
	const rawPage = url.searchParams.get('page')
	const parsed = rawPage === null ? 1 : Number.parseInt(rawPage, 10)
	const page = Number.isFinite(parsed) && parsed > 0 ? parsed : 1

	const result = await locals.pb.collection('news').getList<NewsListRecord>(page, 20, {
		sort: '-published_at',
	})

	return {
		items: result.items,
		page: result.page,
		perPage: result.perPage,
		totalPages: result.totalPages,
	}
}

export const actions: Actions = {
	delete: async ({ locals, request }) => {
		const data = await request.formData()
		const id = data.get('id')
		if (typeof id !== 'string' || !id) {
			return fail(400, { error: 'id is required' })
		}
		await locals.pb.collection('news').delete(id)
		redirect(303, '/cms/news')
	},
}
