import { sanitizeHtml } from '$lib/cms/sanitize'
import { buildPbFileUrl, pbPublicUrl } from '$lib/pb'
import { convertAbsolutePbUrlsToReferences, resolvePbMediaReferences } from '$lib/pb'
import { error, fail, redirect } from '@sveltejs/kit'

import type { Actions, PageServerLoad } from './$types'

type ProjectsRecord = {
	body: string
	draft: boolean
	id: string
	original_id: string
	projectLink: string
	published_at: string
	title: string
	type: string[]
}

export const load: PageServerLoad = async ({ locals, params }) => {
	let record: ProjectsRecord
	try {
		record = await locals.pb.collection('projects').getOne<ProjectsRecord>(params.id)
	} catch {
		error(404, 'プロジェクトが見つかりません')
	}
	type MediaRecord = { alt: string; file: string; id: string }
	const mediaResult = await locals.pb.collection('media').getList<MediaRecord>(1, 30, { sort: '-created' })
	const mediaItems = mediaResult.items.map(r => ({
		alt: r.alt,
		id: r.id,
		thumbUrl: buildPbFileUrl('media', r.id, r.file, { thumb: '200x200' }),
	}))

	const body = await resolvePbMediaReferences(convertAbsolutePbUrlsToReferences(record.body), locals.pb, pbPublicUrl)
	return { mediaItems, record: { ...record, body: body ?? '' } }
}

export const actions: Actions = {
	default: async ({ locals, params, request }) => {
		const data = await request.formData()
		const title = data.get('title')
		const bodyRaw = data.get('body')
		const body = typeof bodyRaw === 'string' ? sanitizeHtml(convertAbsolutePbUrlsToReferences(bodyRaw) ?? bodyRaw) : ''
		const projectLink = data.get('projectLink') ?? ''
		const type = data.getAll('type').filter((v): v is string => typeof v === 'string')
		const draft = data.get('draft') === 'on'
		const publishedAtRaw = data.get('published_at')
		const published_at = typeof publishedAtRaw === 'string' && publishedAtRaw ? new Date(publishedAtRaw).toISOString() : ''

		if (typeof title !== 'string' || !title) return fail(400, { error: 'タイトルを入力してください' })

		await locals.pb.collection('projects').update(params.id, {
			body,
			draft,
			projectLink: typeof projectLink === 'string' ? projectLink : '',
			published_at,
			title,
			type,
		})

		redirect(303, '/cms/projects')
	},
}
