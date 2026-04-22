import sharp from 'sharp'
import { describe, expect, test } from 'vitest'

import { compressImage } from './compress'

async function makePng(width: number, height: number): Promise<Buffer> {
	return sharp({
		create: {
			background: '#ff0000',
			channels: 3,
			height,
			width,
		},
	})
		.png()
		.toBuffer()
}

describe('compressImage', () => {
	test('output format is webp', async () => {
		const input = await makePng(10, 10)
		const result = await compressImage(input)
		expect(result.format).toBe('webp')
	})

	test('returns non-zero width and height', async () => {
		const input = await makePng(10, 10)
		const result = await compressImage(input)
		expect(result.width).toBeGreaterThan(0)
		expect(result.height).toBeGreaterThan(0)
	})

	test('small image stays small (withoutEnlargement)', async () => {
		const input = await makePng(10, 10)
		const result = await compressImage(input)
		expect(result.width).toBeLessThanOrEqual(10)
	})

	test('wide image is resized to maxWidth', async () => {
		const input = await makePng(3000, 100)
		const result = await compressImage(input, { maxWidth: 1920 })
		expect(result.width).toBeLessThanOrEqual(1920)
	})

	test('buffer is a Buffer instance and non-empty', async () => {
		const input = await makePng(10, 10)
		const result = await compressImage(input)
		expect(Buffer.isBuffer(result.buffer)).toBe(true)
		expect(result.buffer.length).toBeGreaterThan(0)
	})
})
