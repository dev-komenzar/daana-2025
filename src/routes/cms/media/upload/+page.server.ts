import { compressImage } from '$lib/cms/media/compress'
import { fail, redirect } from '@sveltejs/kit'

import type { Actions } from './$types'

const MAX_UPLOAD_BYTES = 20 * 1024 * 1024
const MAX_STORED_BYTES = 10 * 1024 * 1024

export const actions: Actions = {
	default: async ({ locals, request }) => {
		if (locals.user?.role !== 'editor') return fail(403, { error: 'editor 権限が必要です' })

		let data: FormData
		try {
			data = await request.formData()
		} catch (error) {
			// adapter-node が BODY_SIZE_LIMIT 超過時に投げるエラーを握り、ユーザー向けメッセージに変換する
			if (error instanceof Error && /exceeds limit/.test(error.message)) {
				return fail(413, { error: '画像は 20MB 以下にしてください (受信サイズ上限を超えました)' })
			}
			throw error
		}
		const alt = data.get('alt')
		const caption = data.get('caption')
		const file = data.get('file')

		if (!(file instanceof File) || file.size === 0) return fail(400, { error: 'ファイルを選択してください' })
		if (typeof alt !== 'string' || !alt) return fail(400, { error: 'alt テキストを入力してください' })
		if (!file.type.startsWith('image/')) return fail(400, { error: '画像ファイルを選択してください' })
		if (file.size > MAX_UPLOAD_BYTES) return fail(413, { error: '画像は 20MB 以下にしてください' })

		const buffer = Buffer.from(await file.arrayBuffer())
		const compressed = await compressImage(buffer)
		if (compressed.buffer.length > MAX_STORED_BYTES) {
			return fail(413, { error: '圧縮後も画像サイズが大きすぎます (10MB 超)。別の画像をお試しください' })
		}

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
