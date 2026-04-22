import { type OptimizedImage, optimizeImage, type PipelineOptions } from './image-pipeline'

export type ImageFetcher = (url: string) => Promise<Buffer>

export type MediaCreateInput = {
	alt: string
	fileBuffer: Buffer
	fileName: string
	height?: number
	mime: string
	originalUrl: string
	width?: number
}

export interface MediaRepository {
	create(input: MediaCreateInput): Promise<UploadedMedia>
	findByOriginalUrl(originalUrl: string): Promise<undefined | UploadedMedia>
}

export type UploadedMedia = {
	fileUrl: string
	height?: number
	id: string
	mime?: string
	originalUrl: string
	width?: number
}

export type UploadOrFindOptions = {
	alt?: string
	fetcher: ImageFetcher
	optimizer?: (input: Buffer, options?: PipelineOptions) => Promise<OptimizedImage>
	pipelineOptions?: PipelineOptions
	repo: MediaRepository
}

export function deriveFilename(url: string, format: string): string {
	let pathTail = 'image'
	try {
		const urlObj = new URL(url)
		pathTail = urlObj.pathname.split('/').findLast(Boolean) ?? 'image'
	} catch {
		pathTail = url.split('/').findLast(Boolean) ?? 'image'
	}
	const base = pathTail.replace(/\.[a-z0-9]+$/i, '') || 'image'
	const ext = format === 'jpeg' ? 'jpg' : format
	return `${base}.${ext}`
}

export function formatToMime(format: string): string {
	if (format === 'jpeg' || format === 'jpg') return 'image/jpeg'
	if (format === 'png') return 'image/png'
	if (format === 'webp') return 'image/webp'
	if (format === 'gif') return 'image/gif'
	if (format === 'avif') return 'image/avif'
	return 'application/octet-stream'
}

export async function uploadOrFindMedia(sourceUrl: string, options: UploadOrFindOptions): Promise<UploadedMedia> {
	if (!sourceUrl) {
		throw new Error('uploadOrFindMedia: sourceUrl is required')
	}
	const existing = await options.repo.findByOriginalUrl(sourceUrl)
	if (existing) return existing

	const buffer = await options.fetcher(sourceUrl)
	const optimize = options.optimizer ?? optimizeImage
	const optimized = await optimize(buffer, options.pipelineOptions)
	const fileName = deriveFilename(sourceUrl, optimized.format)

	return options.repo.create({
		alt: options.alt ?? '',
		fileBuffer: optimized.buffer,
		fileName,
		height: optimized.height,
		mime: formatToMime(optimized.format),
		originalUrl: sourceUrl,
		width: optimized.width,
	})
}
