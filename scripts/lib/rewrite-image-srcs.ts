/**
 * 本文 HTML の <img src> を microCMS URL → PB media URL に書換える純粋関数。
 *
 * Green 実装は daana-ov9.6 で行う。それまでは Not implemented で Red を維持する。
 *
 * TODO(daana-ov9.6): <picture> / srcset 対応は別タスクとする。
 */
export function rewriteImageSrcs(_html: string, _urlMap: Map<string, string>): string {
	throw new Error('Not implemented: daana-ov9.6')
}
