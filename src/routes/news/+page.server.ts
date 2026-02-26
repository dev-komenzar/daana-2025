import { getNewsAsync, getNewsTotalCount } from '$lib/news/app'

import type { PageServerLoad } from './$types'

const ITEMS_PER_PAGE = 10

export const load: PageServerLoad = async () => {
	const [newsItems, totalCount] = await Promise.all([getNewsAsync(0, ITEMS_PER_PAGE, ['id', 'title', 'publishedAt', 'thumbnail']), getNewsTotalCount()])

	return {
		newsItems,
		totalCount,
	}
}
