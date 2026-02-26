import { getNewsAsync, getPinnedNews } from '$lib/news/app'

import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
	const [newsItems, pinnedNewsItems] = await Promise.all([getNewsAsync(0, 3, ['id', 'title', 'publishedAt', 'thumbnail', 'content']), getPinnedNews(5, ['id', 'title', 'publishedAt', 'thumbnail', 'content'])])

	return {
		newsItems,
		pinnedNewsItems,
	}
}
