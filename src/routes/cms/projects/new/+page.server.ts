import { sanitizeHtml } from '$lib/cms/sanitize'
import { fail, redirect } from '@sveltejs/kit'

import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
	type MediaRecord = { alt: string; file: string; id: string }
	const result = await locals.pb.collection('media').getList<MediaRecord>(1, 30, { sort: '-created' })
	const mediaItems = result.items.map(r => ({
		alt: r.alt,
		id: r.id,
		src: locals.pb.files.getUrl(r, r.file),
		thumbUrl: locals.pb.files.getUrl(r, r.file, { thumb: '200x200' }),
	}))
	return { mediaItems }
}

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const data = await request.formData()
		const title = data.get('title')
		const bodyRaw = data.get('body')
		const body = typeof bodyRaw === 'string' ? sanitizeHtml(bodyRaw) : ''
		const projectLink = data.get('projectLink') ?? ''
		const type = data.getAll('type').filter((v): v is string => typeof v === 'string')
		const draft = data.get('draft') === 'on'
		const publishedAtRaw = data.get('published_at')
		const published_at = typeof publishedAtRaw === 'string' && publishedAtRaw ? new Date(publishedAtRaw).toISOString() : ''

		if (typeof title !== 'string' || !title) return fail(400, { error: 'タイトルを入力してください' })

		const record = await locals.pb.collection('projects').create({
			body,
			draft,
			projectLink: typeof projectLink === 'string' ? projectLink : '',
			published_at,
			title,
			type,
		})

		redirect(303, `/cms/projects/${record.id}/edit`)
	},
}
