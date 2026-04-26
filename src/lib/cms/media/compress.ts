import sharp from 'sharp'

export type CompressResult = {
	buffer: Buffer
	format: 'webp'
	height: number
	width: number
}

export async function compressImage(input: ArrayBuffer | Buffer, options: { maxWidth?: number; quality?: number } = {}): Promise<CompressResult> {
	const { maxWidth = 1920, quality = 85 } = options
	const pipeline = sharp(input).resize({ width: maxWidth, withoutEnlargement: true }).webp({ quality })
	const buffer = await pipeline.toBuffer()
	const metadata = await sharp(buffer).metadata()
	return {
		buffer,
		format: 'webp',
		height: metadata.height ?? 0,
		width: metadata.width ?? 0,
	}
}
