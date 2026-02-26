/**
 * floatUp アクションのオプション
 */
export interface FloatUpOptions {
	/** 侵入アニメーション時間（秒）。デフォルト: 0.5 */
	durationEnter?: number
	/** 退出アニメーション時間（秒）。デフォルト: 0.35 */
	durationExit?: number
	/** 初期スケール値。デフォルト: 0.98 */
	scaleFrom?: number
	/** トリガーに必要なビューポート内表示率（0-1）。デフォルト: 0.3 */
	threshold?: number
	/** Y軸移動量（px）。正の値 = 下から開始。デフォルト: 6 */
	translateY?: number
}

/**
 * スクロールトリガーの「ふわっと浮き上がる」アニメーション用Svelteアクション。
 * ビューポートへの侵入・退出時にフェードイン、translateY、スケールアニメーションを適用。
 *
 * CSSトランジションを使用してページ遷移時のエラーを回避。
 *
 * @example
 * <h2 use:floatUp>タイトル</h2>
 * <p use:floatUp={{ translateY: 10 }}>コンテンツ</p>
 */
export function floatUp(node: HTMLElement, options: FloatUpOptions = {}): { destroy: () => void } {
	const { durationEnter = 0.5, durationExit = 0.35, scaleFrom = 0.98, threshold = 0.3, translateY = 6 } = options

	// 破棄フラグ
	let isDestroyed = false

	// 初期状態: 不可視、下にオフセット、やや縮小
	node.style.opacity = '0'
	node.style.scale = String(scaleFrom)
	node.style.translate = `0 ${translateY}px`
	node.style.willChange = 'scale, translate, opacity'

	// 侵入アニメーション（CSSトランジションで実装）
	function animateEnter() {
		if (isDestroyed || !node.isConnected) return

		// トランジションを設定
		node.style.transition = `opacity ${durationEnter}s cubic-bezier(0.25, 0.1, 0.25, 1), translate ${durationEnter}s cubic-bezier(0.25, 0.1, 0.25, 1), scale ${durationEnter * 1.5}s cubic-bezier(0.34, 1.56, 0.64, 1)`

		// 次のフレームでスタイルを変更（トランジションを確実に適用）
		requestAnimationFrame(() => {
			if (isDestroyed || !node.isConnected) return
			node.style.opacity = '1'
			node.style.translate = '0 0'
			node.style.scale = '1'
		})
	}

	// 退出アニメーション
	function animateExit() {
		if (isDestroyed || !node.isConnected) return

		// トランジションを設定
		node.style.transition = `opacity ${durationExit}s cubic-bezier(0.25, 0.1, 0.25, 1), translate ${durationExit}s cubic-bezier(0.25, 0.1, 0.25, 1), scale ${durationExit * 1.2}s cubic-bezier(0.34, 1.2, 0.64, 1)`

		requestAnimationFrame(() => {
			if (isDestroyed || !node.isConnected) return
			node.style.opacity = '0'
			node.style.translate = `0 ${translateY}px`
			node.style.scale = String(scaleFrom)
		})
	}

	// IntersectionObserver で監視
	const observer = new IntersectionObserver(
		entries => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					animateEnter()
				} else {
					animateExit()
				}
			}
		},
		{ threshold },
	)

	observer.observe(node)

	return {
		destroy() {
			isDestroyed = true
			observer.disconnect()

			// スタイルのクリーンアップ
			if (node.isConnected) {
				node.style.willChange = ''
				node.style.scale = ''
				node.style.translate = ''
				node.style.transition = ''
			}
		},
	}
}
