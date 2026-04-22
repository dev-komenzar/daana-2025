import sharp from 'sharp'

export interface OptimizedImage {
	buffer: Buffer
	format: string
	height: number
	width: number
}

export interface PipelineOptions {
	jpegQuality?: number
	maxLongEdge?: number
}

const DEFAULT_MAX_LONG_EDGE = 2400
const DEFAULT_JPEG_QUALITY = 82

export async function optimizeImage(input: Buffer, options: PipelineOptions = {}): Promise<OptimizedImage> {
	const maxLongEdge = options.maxLongEdge ?? DEFAULT_MAX_LONG_EDGE
	const jpegQuality = options.jpegQuality ?? DEFAULT_JPEG_QUALITY

	const source = sharp(input, { failOn: 'error' })
	const meta = await source.metadata()
	const format = meta.format ?? 'jpeg'
	const longEdge = Math.max(meta.width ?? 0, meta.height ?? 0)
	const needsResize = longEdge > maxLongEdge

	let pipeline = sharp(input, { failOn: 'error' }).rotate()
	if (needsResize) {
		pipeline = pipeline.resize({
			fit: 'inside',
			height: maxLongEdge,
			width: maxLongEdge,
			withoutEnlargement: true,
		})
	}

	// sharp は .withMetadata() を呼ばない限り EXIF を剥がすので、ここでは明示的に呼ばない。
	pipeline = format === 'png' ? pipeline.png({ compressionLevel: 9 }) : format === 'webp' ? pipeline.webp({ quality: jpegQuality }) : pipeline.jpeg({ mozjpeg: true, quality: jpegQuality })

	const { data, info } = await pipeline.toBuffer({ resolveWithObject: true })
	return {
		buffer: data,
		format: info.format,
		height: info.height,
		width: info.width,
	}
}
