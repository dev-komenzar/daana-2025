import { buildPbFileUrl, pbBaseUrl } from './client'

const PB_FILE_URL_RE = /https?:\/\/[^"'\s>]*\/api\/files\/([a-zA-Z0-9]+)\/([a-zA-Z0-9]+)\/([^"'\s>]+)/g
const PB_MEDIA_REF_RE = /pb-media:\/\/([a-zA-Z0-9]+)/g

type PbLike = {
	collection: (name: string) => { getOne: (id: string) => Promise<Record<string, unknown>> }
}

export function buildPbFileUrlWithBase(baseUrl: string, collectionIdOrName: string, recordId: string, filename: string): string {
	if (baseUrl === pbBaseUrl) return buildPbFileUrl(collectionIdOrName, recordId, filename)
	return `${baseUrl}/api/files/${collectionIdOrName}/${recordId}/${filename}`
}

export function convertAbsolutePbUrlsToReferences(html: string | undefined): string | undefined {
	if (!html) return html
	return html.replaceAll(PB_FILE_URL_RE, (_match, _collectionId, recordId, _filename) => `pb-media://${recordId}`)
}

export async function resolvePbMediaReferences(html: string | undefined, pb: PbLike, baseUrl: string): Promise<string | undefined> {
	if (!html) return html
	const ids = [...new Set([...html.matchAll(PB_MEDIA_REF_RE)].map(m => m[1]))]
	if (ids.length === 0) return html

	const urlMap = new Map<string, string>()
	await Promise.all(
		ids.map(async id => {
			try {
				const record = await pb.collection('media').getOne(id)
				const file = (record as { file?: string }).file
				if (file) {
					urlMap.set(id, buildPbFileUrlWithBase(baseUrl, 'media', id, file))
				}
			} catch {
				// leave unresolved if media record missing
			}
		}),
	)

	let result = html
	for (const [id, url] of urlMap) {
		result = result.replaceAll(`pb-media://${id}`, url)
	}
	return result
}
