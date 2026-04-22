import { describe, expect, test, vi } from 'vitest'

import type { OptimizedImage } from './image-pipeline'

import { deriveFilename, formatToMime, type MediaRepository, type UploadedMedia, uploadOrFindMedia } from './media-upload'

function createStubRepo(seed: UploadedMedia[] = []): MediaRepository & { created: UploadedMedia[] } {
	const store = new Map<string, UploadedMedia>(seed.map(m => [m.originalUrl, m]))
	const created: UploadedMedia[] = []
	return {
		async create(input) {
			const uploaded: UploadedMedia = {
				fileUrl: `http://pb.local/api/files/media/${input.fileName}`,
				height: input.height,
				id: `media-${store.size + 1}`,
				mime: input.mime,
				originalUrl: input.originalUrl,
				width: input.width,
			}
			store.set(input.originalUrl, uploaded)
			created.push(uploaded)
			return uploaded
		},
		created,
		async findByOriginalUrl(originalUrl) {
			return store.get(originalUrl)
		},
	}
}

const fakeOptimized: OptimizedImage = {
	buffer: Buffer.from('optimized-bytes'),
	format: 'jpeg',
	height: 800,
	width: 1200,
}

const fakeOptimizer = vi.fn(async () => fakeOptimized)

describe('uploadOrFindMedia (daana-ov9.5)', () => {
	test('既存レコードが findByOriginalUrl で見つかれば create しない (冪等)', async () => {
		const existing: UploadedMedia = {
			fileUrl: 'http://pb.local/api/files/media/existing.jpg',
			id: 'media-42',
			originalUrl: 'https://images.microcms-assets.io/assets/a.jpg',
		}
		const repo = createStubRepo([existing])
		const fetcher = vi.fn(async () => Buffer.from('should-not-be-called'))

		const result = await uploadOrFindMedia(existing.originalUrl, {
			fetcher,
			optimizer: fakeOptimizer,
			repo,
		})

		expect(result).toEqual(existing)
		expect(fetcher).not.toHaveBeenCalled()
		expect(repo.created).toHaveLength(0)
	})

	test('存在しなければ fetch → optimize → create し、冪等化のため originalUrl を保存する', async () => {
		const repo = createStubRepo()
		const fetcher = vi.fn(async () => Buffer.from('source-bytes'))
		fakeOptimizer.mockClear()

		const result = await uploadOrFindMedia('https://images.microcms-assets.io/assets/new.jpg', {
			alt: 'sample',
			fetcher,
			optimizer: fakeOptimizer,
			repo,
		})

		expect(fetcher).toHaveBeenCalledWith('https://images.microcms-assets.io/assets/new.jpg')
		expect(fakeOptimizer).toHaveBeenCalledTimes(1)
		expect(repo.created).toHaveLength(1)
		expect(repo.created[0]?.originalUrl).toBe('https://images.microcms-assets.io/assets/new.jpg')
		expect(result.fileUrl).toContain('new.jpg')
	})

	test('二度流しても media のレコード数が増えない (ov9.5 受入基準)', async () => {
		const repo = createStubRepo()
		const fetcher = vi.fn(async () => Buffer.from('src'))

		const url = 'https://images.microcms-assets.io/assets/dup.jpg'
		const first = await uploadOrFindMedia(url, { fetcher, optimizer: fakeOptimizer, repo })
		const second = await uploadOrFindMedia(url, { fetcher, optimizer: fakeOptimizer, repo })

		expect(first.id).toBe(second.id)
		expect(repo.created).toHaveLength(1)
		expect(fetcher).toHaveBeenCalledTimes(1)
	})

	test('sourceUrl が空なら例外', async () => {
		const repo = createStubRepo()
		await expect(
			uploadOrFindMedia('', {
				fetcher: async () => Buffer.alloc(0),
				optimizer: fakeOptimizer,
				repo,
			}),
		).rejects.toThrow(/sourceUrl/)
	})
})

describe('deriveFilename / formatToMime', () => {
	test('URL から末尾セグメントを抜き拡張子を最適化フォーマットに揃える', () => {
		expect(deriveFilename('https://images.microcms-assets.io/assets/abcd/photo.png', 'jpeg')).toBe('photo.jpg')
		expect(deriveFilename('https://images.microcms-assets.io/assets/abcd/photo', 'webp')).toBe('photo.webp')
	})

	test('URL 不正時も落ちず fallback', () => {
		expect(deriveFilename('not-a-url/x.jpg', 'jpeg')).toBe('x.jpg')
	})

	test('formatToMime は既知形式を image/* に変換', () => {
		expect(formatToMime('jpeg')).toBe('image/jpeg')
		expect(formatToMime('png')).toBe('image/png')
		expect(formatToMime('webp')).toBe('image/webp')
		expect(formatToMime('unknown')).toBe('application/octet-stream')
	})
})
