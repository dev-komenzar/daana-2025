import type PocketBase from 'pocketbase'
import type { RecordModel } from 'pocketbase'

import type { MediaCreateInput, MediaRepository, UploadedMedia } from './media-upload'

export function createPbMediaRepo(pb: PocketBase): MediaRepository {
	return {
		async create(input: MediaCreateInput): Promise<UploadedMedia> {
			const form = new FormData()
			form.append('original_url', input.originalUrl)
			form.append('alt', input.alt)
			if (input.mime) form.append('mime', input.mime)
			if (input.width !== undefined) form.append('width', String(input.width))
			if (input.height !== undefined) form.append('height', String(input.height))
			const blob = new Blob([input.fileBuffer], { type: input.mime })
			form.append('file', blob, input.fileName)

			const record = await pb.collection('media').create(form)
			return toUploadedMedia(pb, record)
		},
		async findByOriginalUrl(originalUrl: string): Promise<undefined | UploadedMedia> {
			const escaped = originalUrl.replaceAll('"', String.raw`\"`)
			try {
				const record = await pb.collection('media').getFirstListItem(`original_url="${escaped}"`)
				return toUploadedMedia(pb, record)
			} catch (error) {
				if (isNotFound(error)) return undefined
				throw error
			}
		},
	}
}

/**
 * pb_migrations の追加フィールドをサーバ再起動無しで反映するための schema 同期。
 * 新規追加したフィールドが無い場合のみ admin API で collection.schema を更新する。
 */
export async function ensureMediaOriginalUrlField(pb: PocketBase): Promise<void> {
	const collection = await pb.collections.getOne('media')
	const schema: Array<{ name: string }> = [...((collection as unknown as { schema: Array<{ name: string }> }).schema ?? [])]
	if (schema.some(field => field.name === 'original_url')) return

	const updated = {
		...collection,
		schema: [
			...schema,
			{
				id: 'md_originalUrl',
				name: 'original_url',
				// unicorn/no-null: PocketBase の text field options は min を null にする契約
				// eslint-disable-next-line unicorn/no-null
				options: { max: 512, min: null, pattern: '' },
				required: false,
				system: false,
				type: 'text',
				unique: false,
			},
		],
	}
	await pb.collections.update('media', updated as unknown as Record<string, unknown>)
}

function isNotFound(error: unknown): boolean {
	return typeof error === 'object' && error !== null && 'status' in error && (error as { status?: number }).status === 404
}

function toUploadedMedia(pb: PocketBase, record: RecordModel): UploadedMedia {
	const filename: string = typeof record.file === 'string' ? record.file : ''
	return {
		fileUrl: filename ? pb.files.getUrl(record, filename) : '',
		height: typeof record.height === 'number' ? record.height : undefined,
		id: record.id,
		mime: typeof record.mime === 'string' ? record.mime : undefined,
		originalUrl: typeof record.original_url === 'string' ? record.original_url : '',
		width: typeof record.width === 'number' ? record.width : undefined,
	}
}
