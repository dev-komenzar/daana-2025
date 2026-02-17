import { getNewsPost } from '$lib/cms'
import { error } from '@sveltejs/kit'

import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params
	const newsPost = await getNewsPost(slug)

	if (!newsPost) {
		throw error(404, 'ニュースが見つかりませんでした')
	}

	return { newsPost }
}
