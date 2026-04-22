/**
 * HTML 内の <img src="..."> から URL を重複排除して抽出する。
 * 本文中の画像参照を媒体 repo に寄せるため、移行スクリプトで使用する。
 */
export function extractImageSrcs(html: string): string[] {
	if (!html) return []
	const pattern = /<img\b[^>]*?\ssrc\s*=\s*["']([^"']+)["']/gi
	const seen = new Set<string>()
	for (const match of html.matchAll(pattern)) {
		const url = match[1]
		if (url) seen.add(url)
	}
	return [...seen]
}

/**
 * HTML 本文内の <img src="..."> を urlMap に従って置換する純粋関数。
 * daana-275 Red → daana-ov9.6 Green 実装。
 *
 * DOM パーサを使わず src 属性を局所的に書換えるため、
 * 他の属性 (alt / width / loading) やインデントは保持される。
 *
 * TODO(ov9 後継): <picture> / srcset 対応は別タスクとする。
 */
export function rewriteImageSrcs(html: string, urlMap: Map<string, string>): string {
	if (!html || urlMap.size === 0) return html

	let result = html
	for (const [source, target] of urlMap) {
		if (source === target) continue
		const escaped = escapeRegExp(source)
		const pattern = new RegExp(String.raw`(src\s*=\s*["'])${escaped}(["'])`, 'g')
		result = result.replace(pattern, `$1${target}$2`)
	}
	return result
}

function escapeRegExp(value: string): string {
	return value.replaceAll(/[$()*+.?[\\\]^{|}]/g, String.raw`\$&`)
}
