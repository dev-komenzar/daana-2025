/**
 * sharp による画像最適化パイプライン (mozjpeg, 2400px 上限, EXIF 除去)。
 *
 * Green 実装は daana-ov9.4 で行う。それまでは Red を維持する。
 */

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

export async function optimizeImage(_input: Buffer, _options: PipelineOptions = {}): Promise<OptimizedImage> {
	throw new Error('Not implemented: daana-ov9.4')
}
