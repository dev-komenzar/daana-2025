import { compressImage } from '$lib/cms/media/compress'
import { fail, redirect } from '@sveltejs/kit'

import type { Actions } from './$types'

export const actions: Actions = {
	default: async ({ locals, request }) => {
		if (locals.user?.role !== 'editor') return fail(403, { error: 'editor 権限が必要です' })

		const data = await request.formData()
		const alt = data.get('alt')
		const caption = data.get('caption')
		const file = data.get('file')

		if (!(file instanceof File) || file.size === 0) return fail(400, { error: 'ファイルを選択してください' })
		if (typeof alt !== 'string' || !alt) return fail(400, { error: 'alt テキストを入力してください' })
		if (!file.type.startsWith('image/')) return fail(400, { error: '画像ファイルを選択してください' })

		const buffer = Buffer.from(await file.arrayBuffer())
		const compressed = await compressImage(buffer)

		const pbForm = new FormData()
		const processedBlob = new Blob([new Uint8Array(compressed.buffer)], { type: 'image/webp' })
		pbForm.set('alt', alt)
		pbForm.set('file', processedBlob, 'processed.webp')
		pbForm.set('height', String(compressed.height))
		pbForm.set('mime', 'image/webp')
		pbForm.set('width', String(compressed.width))
		if (typeof caption === 'string' && caption) pbForm.set('caption', caption)

		try {
			await locals.pb.collection('media').create(pbForm)
		} catch {
			return fail(500, { error: 'アップロードに失敗しました' })
		}

		redirect(303, '/cms/media')
	},
}
