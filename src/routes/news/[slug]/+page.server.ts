import { getNewsByOriginalId, getNewsPost } from '$lib/news/app'
import { error, redirect } from '@sveltejs/kit'

import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params }) => {
	const { slug } = params
	const newsPost = await getNewsPost(slug)

	if (newsPost) {
		return { newsPost }
	}

	// id として見つからなければ旧 microCMS id (original_id) での再検索 → 新URLへ 301
	const byOriginal = await getNewsByOriginalId(slug)
	if (byOriginal && byOriginal.id !== slug) {
		redirect(301, `/news/${byOriginal.id}`)
	}

	throw error(404, 'ニュースが見つかりませんでした')
}
