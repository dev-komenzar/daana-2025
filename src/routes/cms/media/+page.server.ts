import { fail, redirect } from '@sveltejs/kit'

import type { Actions, PageServerLoad } from './$types'

type MediaRecord = {
	alt: string
	caption?: string
	file: string
	height?: number
	id: string
	width?: number
}

const PER_PAGE = 30
// media コレクションに tag フィールドは無いため、task 要件の tag 検索は file/alt/caption 横断検索で代用。
// tag フィールドが追加された場合はここに追記する。
const SEARCH_FIELDS = 'file ~ {:q} || alt ~ {:q} || caption ~ {:q}'

export const load: PageServerLoad = async ({ locals, url }) => {
	const rawPage = url.searchParams.get('page')
	const parsed = rawPage === null ? 1 : Number.parseInt(rawPage, 10)
	const page = Number.isFinite(parsed) && parsed > 0 ? parsed : 1

	const q = url.searchParams.get('q')?.trim() ?? ''

	// eslint-disable-next-line unicorn/no-array-callback-reference, unicorn/no-array-method-this-argument -- pb.filter は PocketBase の API。Array#filter ではない
	const filter = q ? locals.pb.filter(SEARCH_FIELDS, { q }) : ''

	const options = { sort: '-created', ...(filter ? { filter } : {}) }
	const result = await locals.pb.collection('media').getList<MediaRecord>(page, PER_PAGE, options)

	const items = result.items.map(record => ({
		alt: record.alt,
		fileName: record.file,
		height: record.height,
		id: record.id,
		thumbUrl: locals.pb.files.getUrl(record, record.file, { thumb: '200x200' }),
		width: record.width,
	}))

	return {
		items,
		page: result.page,
		perPage: result.perPage,
		q,
		totalPages: result.totalPages,
	}
}

export const actions: Actions = {
	delete: async ({ locals, request }) => {
		const data = await request.formData()
		const id = data.get('id')
		if (typeof id !== 'string' || !id) {
			return fail(400, { error: 'id is required' })
		}
		await locals.pb.collection('media').delete(id)
		redirect(303, '/cms/media')
	},
}
