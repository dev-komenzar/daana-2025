import sharp from 'sharp'
import { beforeAll, describe, expect, test } from 'vitest'

import { optimizeImage } from './image-pipeline'

// Red: Green 実装 (daana-ov9.4) 完了までは全件失敗する想定。
// fixture 画像は beforeAll で sharp から動的生成して検証する。
describe('optimizeImage (daana-ol1 Red → daana-ov9.4 Green)', () => {
	let bigJpeg: Buffer
	let smallJpeg: Buffer
	let pngSample: Buffer

	beforeAll(async () => {
		// 3000x2000 の単色 JPEG (EXIF 相当のメタデータ付き)
		bigJpeg = await sharp({
			create: { background: { b: 200, g: 160, r: 120 }, channels: 3, height: 2000, width: 3000 },
		})
			.withMetadata({ exif: { IFD0: { Copyright: 'test-exif' } } })
			.jpeg({ quality: 95 })
			.toBuffer()

		// 2000x1500 の JPEG (上限以下)
		smallJpeg = await sharp({
			create: { background: { b: 150, g: 100, r: 50 }, channels: 3, height: 1500, width: 2000 },
		})
			.jpeg({ quality: 90 })
			.toBuffer()

		pngSample = await sharp({
			create: { background: { alpha: 0.5, b: 0, g: 0, r: 255 }, channels: 4, height: 600, width: 800 },
		})
			.png()
			.toBuffer()
	})

	test('3000x2000 JPEG を入力すると、長辺 2400 以下にリサイズされる', async () => {
		const result = await optimizeImage(bigJpeg)
		expect(Math.max(result.width, result.height)).toBeLessThanOrEqual(2400)
	})

	test('2000x1500 JPEG (上限以下) はリサイズされない', async () => {
		const result = await optimizeImage(smallJpeg)
		expect(result.width).toBe(2000)
		expect(result.height).toBe(1500)
	})

	test('出力 buffer から EXIF が除去されている', async () => {
		const result = await optimizeImage(bigJpeg)
		const meta = await sharp(result.buffer).metadata()
		// exif が存在しないか、Copyright キーが含まれないこと
		const hasOriginalExif = meta.exif && meta.exif.toString().includes('test-exif')
		expect(hasOriginalExif).toBeFalsy()
	})

	test('JPEG 出力が mozjpeg エンコードで quality オプションを反映できる', async () => {
		const lowQuality = await optimizeImage(bigJpeg, { jpegQuality: 40 })
		const highQuality = await optimizeImage(bigJpeg, { jpegQuality: 90 })
		// quality 低い方がファイルサイズが小さいことで mozjpeg が効いていることを確認
		expect(lowQuality.buffer.byteLength).toBeLessThan(highQuality.buffer.byteLength)
	})

	test('PNG 入力も扱える (JPEG に統一もしくは形式維持は実装で確定)', async () => {
		const result = await optimizeImage(pngSample)
		expect(['jpeg', 'png', 'webp']).toContain(result.format)
		expect(result.width).toBeLessThanOrEqual(800)
	})
})
