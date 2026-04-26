import { describe, expect, test, vi } from 'vitest'

vi.mock('$lib/cms/media/compress', () => ({
	compressImage: vi.fn().mockResolvedValue({
		buffer: Buffer.from('fake-webp'),
		format: 'webp',
		height: 100,
		width: 200,
	}),
}))

import { actions } from './+page.server'

type MockPb = {
	collection: ReturnType<typeof vi.fn>
}

async function makeEvent(formData: FormData, role: string | undefined, pb: MockPb): Promise<Parameters<NonNullable<typeof actions>['default']>[0]> {
	const request = new Request('http://localhost/cms/media/upload', {
		body: formData,
		method: 'POST',
	})
	return {
		locals: makeLocals(role, pb),
		request,
	} as unknown as Parameters<NonNullable<typeof actions>['default']>[0]
}

function makeLocals(role: string | undefined, pb: MockPb) {
	return {
		pb,
		user: role === undefined ? undefined : { role },
	} as unknown as App.Locals
}

function makePb(overrides?: Partial<MockPb>): MockPb {
	const create = vi.fn().mockResolvedValue({ id: 'new-record' })
	return {
		collection: vi.fn(() => ({ create })),
		...overrides,
	}
}

async function makePngBuffer(): Promise<Buffer> {
	const { default: sharp } = await import('sharp')
	return sharp({
		create: { background: '#ff0000', channels: 3, height: 1, width: 1 },
	})
		.png()
		.toBuffer()
}

describe('actions.default', () => {
	test('editor + valid file + alt → create が呼ばれ 303 /cms/media にリダイレクト', async () => {
		const pb = makePb()
		const buffer = await makePngBuffer()
		const file = new File([new Uint8Array(buffer)], 'test.png', { type: 'image/png' })
		const formData = new FormData()
		formData.set('file', file)
		formData.set('alt', '境内の桜')

		const event = await makeEvent(formData, 'editor', pb)
		await expect(actions.default!(event)).rejects.toMatchObject({ location: '/cms/media', status: 303 })
		expect(pb.collection).toHaveBeenCalledWith('media')
	})

	test('editor 以外のロール → fail(403)', async () => {
		const pb = makePb()
		const formData = new FormData()

		const event = await makeEvent(formData, 'viewer', pb)
		const result = await actions.default!(event)
		expect(result?.status).toBe(403)
	})

	test('user が未定義 → fail(403)', async () => {
		const pb = makePb()
		const formData = new FormData()

		const event = await makeEvent(formData, undefined, pb)
		const result = await actions.default!(event)
		expect(result?.status).toBe(403)
	})

	test('file がない → fail(400)', async () => {
		const pb = makePb()
		const formData = new FormData()
		formData.set('alt', '境内の桜')

		const event = await makeEvent(formData, 'editor', pb)
		const result = await actions.default!(event)
		expect(result?.status).toBe(400)
	})

	test('alt が空文字 → fail(400)', async () => {
		const pb = makePb()
		const buffer = await makePngBuffer()
		const file = new File([new Uint8Array(buffer)], 'test.png', { type: 'image/png' })
		const formData = new FormData()
		formData.set('file', file)
		formData.set('alt', '')

		const event = await makeEvent(formData, 'editor', pb)
		const result = await actions.default!(event)
		expect(result?.status).toBe(400)
	})

	test('非画像 mime type → fail(400)', async () => {
		const pb = makePb()
		const file = new File([new Uint8Array(Buffer.from('%PDF-1.4'))], 'doc.pdf', { type: 'application/pdf' })
		const formData = new FormData()
		formData.set('file', file)
		formData.set('alt', 'a PDF')

		const event = await makeEvent(formData, 'editor', pb)
		const result = await actions.default!(event)
		expect(result?.status).toBe(400)
	})

	test('pb.create が例外を投げると fail(500)', async () => {
		const create = vi.fn().mockRejectedValue(new Error('PB error'))
		const pb = { collection: vi.fn(() => ({ create })) } as unknown as MockPb
		const buffer = await makePngBuffer()
		const file = new File([new Uint8Array(buffer)], 'test.png', { type: 'image/png' })
		const formData = new FormData()
		formData.set('file', file)
		formData.set('alt', '境内の桜')

		const event = await makeEvent(formData, 'editor', pb)
		const result = await actions.default!(event)
		expect(result?.status).toBe(500)
	})
})
