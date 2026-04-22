import { describe, expect, test, vi } from 'vitest'

import type { MicrocmsNewsRaw } from './microcms'
import type { PbRecordLike } from './upsert-action'

import { type NewsRepository, type NewsUpsertInput, syncNewsItem } from './news-sync'

function createStubRepo(seed: Array<NewsUpsertInput & PbRecordLike> = []) {
	const store = new Map<string, NewsUpsertInput & PbRecordLike>(seed.map(r => [r.originalId, r]))
	const created: NewsUpsertInput[] = []
	const updated: Array<{ id: string; input: NewsUpsertInput }> = []
	const repo: NewsRepository = {
		async create(input) {
			const id = `news-${store.size + 1}`
			store.set(input.originalId, { ...input, id })
			created.push(input)
			return { id }
		},
		async findByOriginalId(originalId) {
			const record = store.get(originalId)
			if (!record) return
			return { id: record.id, originalId: record.originalId }
		},
		async update(id, input) {
			store.set(input.originalId, { ...input, id })
			updated.push({ id, input })
			return { id }
		},
	}
	return { created, repo, store, updated }
}

function stubMediaUploader() {
	const calls: string[] = []
	const uploader = vi.fn(async (url: string) => {
		calls.push(url)
		return { id: `media-${calls.length}` }
	})
	return { calls, uploader }
}

const sampleItem: MicrocmsNewsRaw = {
	content: '<p>hello</p><img src="https://images.microcms-assets.io/assets/a.jpg" alt="a" />',
	id: 'news-001',
	pinned: true,
	publishedAt: '2025-10-01T00:00:00.000Z',
	thumbnail: { height: 800, url: 'https://images.microcms-assets.io/assets/thumb.jpg', width: 1200 },
	title: 'タイトル1',
}

describe('syncNewsItem (daana-ov9.7)', () => {
	test('既存なしなら create、media は thumbnail + 本文画像で 2 回アップロードされる', async () => {
		const { created, repo } = createStubRepo()
		const { calls, uploader } = stubMediaUploader()

		const result = await syncNewsItem(sampleItem, { mediaUploader: uploader, repo })

		expect(result.action).toBe('create')
		expect(result.originalId).toBe('news-001')
		expect(created).toHaveLength(1)
		expect(created[0]?.title).toBe('タイトル1')
		expect(created[0]?.thumbnailMediaId).toBe('media-1')
		expect(calls).toHaveLength(2)
		expect(created[0]?.content).toContain('pb-media://media-2')
		expect(created[0]?.content).not.toContain('images.microcms-assets.io')
	})

	test('同じ originalId の既存レコードがあれば update、新規 create は発生しない', async () => {
		const { created, repo, updated } = createStubRepo([
			{
				content: '',
				id: 'pb-xxx',
				originalId: 'news-001',
				title: 'old',
			},
		])
		const { uploader } = stubMediaUploader()

		const result = await syncNewsItem(sampleItem, { mediaUploader: uploader, repo })

		expect(result.action).toBe('update')
		expect(result.id).toBe('pb-xxx')
		expect(updated).toHaveLength(1)
		expect(created).toHaveLength(0)
	})

	test('二度流しても create は 1 回 (受入基準: 件数が増えない)', async () => {
		const { created, repo, updated } = createStubRepo()
		const { uploader } = stubMediaUploader()

		await syncNewsItem(sampleItem, { mediaUploader: uploader, repo })
		await syncNewsItem(sampleItem, { mediaUploader: uploader, repo })

		expect(created).toHaveLength(1)
		expect(updated).toHaveLength(1)
	})

	test('thumbnail なし・content 空でも落ちない', async () => {
		const { created, repo } = createStubRepo()
		const { calls, uploader } = stubMediaUploader()

		const item: MicrocmsNewsRaw = {
			id: 'news-empty',
			title: '空記事',
		}
		const result = await syncNewsItem(item, { mediaUploader: uploader, repo })

		expect(result.action).toBe('create')
		expect(created[0]?.content).toBe('')
		expect(created[0]?.thumbnailMediaId).toBeUndefined()
		expect(calls).toHaveLength(0)
	})

	test('title が空なら例外', async () => {
		const { repo } = createStubRepo()
		const { uploader } = stubMediaUploader()

		await expect(syncNewsItem({ id: 'x' } as MicrocmsNewsRaw, { mediaUploader: uploader, repo })).rejects.toThrow(/title/)
	})
})
