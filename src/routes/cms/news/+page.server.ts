import type { PageServerLoad } from './$types'

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
