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

function isNotFound(error: unknown): boolean {
	return typeof error === 'object' && error !== null && 'status' in error && (error as { status?: number }).status === 404
}

function toUploadedMedia(pb: PocketBase, record: RecordModel): UploadedMedia {
	const filename: string = typeof record.file === 'string' ? record.file : ''
	return {
		fileUrl: filename ? pb.files.getURL(record, filename) : '',
		height: typeof record.height === 'number' ? record.height : undefined,
		id: record.id,
		mime: typeof record.mime === 'string' ? record.mime : undefined,
		originalUrl: typeof record.original_url === 'string' ? record.original_url : '',
		width: typeof record.width === 'number' ? record.width : undefined,
	}
}
