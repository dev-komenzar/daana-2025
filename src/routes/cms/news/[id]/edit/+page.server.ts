import { sanitizeHtml } from '$lib/cms/sanitize'
import { error, fail, redirect } from '@sveltejs/kit'

import type { Actions, PageServerLoad } from './$types'

type NewsRecord = {
	content: string
	draft: boolean
	id: string
	pinned: boolean
	published_at: string
	thumbnail: string
	title: string
}

export const load: PageServerLoad = async ({ locals, params }) => {
	let record: NewsRecord
	try {
		record = await locals.pb.collection('news').getOne<NewsRecord>(params.id)
	} catch {
		error(404, 'お知らせが見つかりません')
	}
	type MediaRecord = { alt: string; file: string; id: string }
	const mediaResult = await locals.pb.collection('media').getList<MediaRecord>(1, 30, { sort: '-created' })
	const mediaItems = mediaResult.items.map(r => ({
		alt: r.alt,
		id: r.id,
		src: locals.pb.files.getUrl(r, r.file),
		thumbUrl: locals.pb.files.getUrl(r, r.file, { thumb: '200x200' }),
	}))
	return { mediaItems, record }
}

export const actions: Actions = {
	default: async ({ locals, params, request }) => {
		const data = await request.formData()
		const title = data.get('title')
		const contentRaw = data.get('content')
		const content = typeof contentRaw === 'string' ? sanitizeHtml(contentRaw) : ''
		const thumbnail = data.get('thumbnail') ?? ''
		const pinned = data.get('pinned') === 'on'
		const draft = data.get('draft') === 'on'
		const publishedAtRaw = data.get('published_at')
		const published_at = typeof publishedAtRaw === 'string' && publishedAtRaw ? new Date(publishedAtRaw).toISOString() : ''

		if (typeof title !== 'string' || !title) return fail(400, { error: 'タイトルを入力してください' })

		await locals.pb.collection('news').update(params.id, {
			content,
			draft,
			pinned,
			published_at,
			thumbnail: typeof thumbnail === 'string' ? thumbnail : '',
			title,
		})

		redirect(303, '/cms/news')
	},
}
