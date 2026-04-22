import { json } from '@sveltejs/kit'

import type { RequestHandler } from './$types'

type MediaRecord = {
	alt: string
	caption?: string
	file: string
	height?: number
	id: string
	width?: number
}

const PER_PAGE = 30
const SEARCH_FILTER = 'file ~ {:q} || alt ~ {:q} || caption ~ {:q}'

export const GET: RequestHandler = async ({ locals, url }) => {
	if (locals.user?.role !== 'editor') return new Response('forbidden', { status: 403 })

	const parsed = Number.parseInt(url.searchParams.get('page') ?? '1', 10)
	const page = Number.isFinite(parsed) && parsed > 0 ? parsed : 1
	const q = url.searchParams.get('q')?.trim() ?? ''

	// eslint-disable-next-line unicorn/no-array-callback-reference, unicorn/no-array-method-this-argument -- pb.filter は PocketBase の API。Array#filter ではない
	const filter = q ? locals.pb.filter(SEARCH_FILTER, { q }) : ''
	const options = filter ? { filter, sort: '-created' } : { sort: '-created' }

	const result = await locals.pb.collection('media').getList<MediaRecord>(page, PER_PAGE, options)

	const items = result.items.map(r => ({
		alt: r.alt,
		id: r.id,
		src: locals.pb.files.getUrl(r, r.file),
		thumbUrl: locals.pb.files.getUrl(r, r.file, { thumb: '200x200' }),
	}))

	return json({ items, page: result.page, totalPages: result.totalPages })
}
