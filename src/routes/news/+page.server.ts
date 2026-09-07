import { getNewsAsync, getNewsTotalCount } from '$lib/news/app'

import type { PageServerLoad } from './$types'

const ITEMS_PER_PAGE = 10

export const load: PageServerLoad = async ({ url }) => {
	const requestedPage = Number.parseInt(url.searchParams.get('page') ?? '1', 10)
	const currentPage = Number.isNaN(requestedPage) || requestedPage < 1 ? 1 : requestedPage
	const offset = (currentPage - 1) * ITEMS_PER_PAGE

	const [newsItems, totalCount] = await Promise.all([getNewsAsync(offset, ITEMS_PER_PAGE, ['id', 'title', 'publishedAt', 'thumbnail']), getNewsTotalCount()])

	const totalPages = totalCount === 0 ? 1 : Math.ceil(totalCount / ITEMS_PER_PAGE)

	return {
		currentPage,
		newsItems,
		totalPages,
	}
}
