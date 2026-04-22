import type { KyInstance } from 'ky'

import type { OptimizedImage, PipelineOptions } from './image-pipeline'
import type { ImageFetcher, MediaRepository, UploadedMedia } from './media-upload'
import type { NewsRepository } from './news-sync'
import type { ProjectRepository } from './project-sync'

import { uploadOrFindMedia } from './media-upload'
import { fetchAllNews, fetchAllProjects } from './microcms'
import { syncNewsItem } from './news-sync'
import { syncProjectItem } from './project-sync'

export type MediaErrorEntry = { message: string; source: string }

export type MigrationReport = {
	dryRun: boolean
	finishedAt: string
	media: { created: number; errors: MediaErrorEntry[]; reused: number }
	news: { created: number; errors: SyncErrorEntry[]; updated: number }
	projects: { created: number; errors: SyncErrorEntry[]; updated: number }
	startedAt: string
	target: MigrationTarget
}
export type MigrationTarget = 'all' | 'media' | 'news' | 'projects'

export type RunMigrationOptions = {
	dryRun: boolean
	fetchImage: ImageFetcher
	logger?: (message: string) => void
	mediaRepo: MediaRepository
	microcms: KyInstance
	newsRepo: NewsRepository
	optimizer?: (input: Buffer, options?: PipelineOptions) => Promise<OptimizedImage>
	projectRepo: ProjectRepository
	target: MigrationTarget
}

export type SyncErrorEntry = { message: string; originalId: string }

type MediaUploaderDeps = {
	fetchImage: ImageFetcher
	mediaRepo: MediaRepository
	onCreated: () => void
	onError: (source: string, error: unknown) => void
	onReused: () => void
	optimizer?: (input: Buffer, options?: PipelineOptions) => Promise<OptimizedImage>
}

export async function defaultImageFetcher(url: string): Promise<Buffer> {
	const response = await fetch(url)
	if (!response.ok) {
		throw new Error(`fetch failed (${response.status}) for ${url}`)
	}
	const arrayBuffer = await response.arrayBuffer()
	return Buffer.from(arrayBuffer)
}

export async function runMigration(options: RunMigrationOptions): Promise<MigrationReport> {
	const log = options.logger ?? (() => {})
	const startedAt = new Date().toISOString()
	const report: MigrationReport = {
		dryRun: options.dryRun,
		finishedAt: '',
		media: { created: 0, errors: [], reused: 0 },
		news: { created: 0, errors: [], updated: 0 },
		projects: { created: 0, errors: [], updated: 0 },
		startedAt,
		target: options.target,
	}

	const wantNews = options.target === 'all' || options.target === 'news'
	const wantProjects = options.target === 'all' || options.target === 'projects'

	const mediaUploader = createMediaUploader({
		fetchImage: options.fetchImage,
		mediaRepo: options.mediaRepo,
		onCreated: () => report.media.created++,
		onError: (source, error) => report.media.errors.push({ message: toMessage(error), source }),
		onReused: () => report.media.reused++,
		optimizer: options.optimizer,
	})

	if (wantNews) {
		log('[migrate] fetching news from microCMS...')
		const items = await fetchAllNews(options.microcms)
		log(`[migrate] news: ${items.length} items to sync (dry-run=${options.dryRun})`)
		for (const item of items) {
			try {
				const result = await syncNewsItem(item, { mediaUploader, repo: options.newsRepo })
				if (result.action === 'create') report.news.created++
				else report.news.updated++
				log(`[migrate] news ${result.action}: ${result.originalId} → ${result.id}`)
			} catch (error) {
				report.news.errors.push({ message: toMessage(error), originalId: item.id })
				log(`[migrate] news error: ${item.id}: ${toMessage(error)}`)
			}
		}
	}

	if (wantProjects) {
		log('[migrate] fetching projects from microCMS...')
		const items = await fetchAllProjects(options.microcms)
		log(`[migrate] projects: ${items.length} items to sync (dry-run=${options.dryRun})`)
		for (const item of items) {
			try {
				const result = await syncProjectItem(item, { mediaUploader, repo: options.projectRepo })
				if (result.action === 'create') report.projects.created++
				else report.projects.updated++
				log(`[migrate] projects ${result.action}: ${result.originalId} → ${result.id}`)
			} catch (error) {
				report.projects.errors.push({ message: toMessage(error), originalId: item.id })
				log(`[migrate] projects error: ${item.id}: ${toMessage(error)}`)
			}
		}
	}

	report.finishedAt = new Date().toISOString()
	return report
}

function createMediaUploader(deps: MediaUploaderDeps): (url: string, alt?: string) => Promise<{ id: string }> {
	return async (sourceUrl: string, alt?: string) => {
		try {
			const existing = await deps.mediaRepo.findByOriginalUrl(sourceUrl)
			if (existing) {
				deps.onReused()
				return existing
			}
			const uploaded: UploadedMedia = await uploadOrFindMedia(sourceUrl, {
				alt,
				fetcher: deps.fetchImage,
				optimizer: deps.optimizer,
				repo: deps.mediaRepo,
			})
			deps.onCreated()
			return uploaded
		} catch (error) {
			deps.onError(sourceUrl, error)
			throw error
		}
	}
}

function toMessage(error: unknown): string {
	if (error instanceof Error) return error.message
	return typeof error === 'string' ? error : JSON.stringify(error)
}
