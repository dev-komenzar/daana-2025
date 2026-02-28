import consola from 'consola'

export interface FontLoaderOptions {
	src: string
	timeout?: number
}

/**
 * Dynamically loads the fontplus.js script with error handling.
 * Falls back gracefully to CSS-defined fallback fonts on failure.
 */
export function loadFontPlusScript(options: FontLoaderOptions): void {
	const { src, timeout = 10_000 } = options

	const script = document.createElement('script')
	script.src = src
	script.async = true

	let timeoutId: ReturnType<typeof setTimeout> | undefined
	let loaded = false

	const cleanup = () => {
		if (timeoutId) {
			clearTimeout(timeoutId)
			timeoutId = undefined
		}
	}

	script.addEventListener('load', () => {
		loaded = true
		cleanup()
		consola.info('[fontplus] Script loaded successfully')

		// SvelteKitのハイドレーション完了後にフォントプラスを再スキャンさせる
		// 初期スキャン時にはDOMが完全に構築されていない可能性があるため
		setTimeout(() => {
			const fontplus = (globalThis as unknown as { FONTPLUS?: { reload: () => void } }).FONTPLUS
			if (fontplus?.reload) {
				fontplus.reload()
				consola.info('[fontplus] Triggered reload for hydrated DOM')
			}
		}, 100)
	})

	script.addEventListener('error', () => {
		cleanup()
		consola.warn('[fontplus] Script load failed. Using fallback fonts.')
	})

	timeoutId = setTimeout(() => {
		if (loaded) return
		consola.warn(`[fontplus] Script load timeout (${timeout}ms). Using fallback fonts.`)
	}, timeout)

	document.head.append(script)
}
