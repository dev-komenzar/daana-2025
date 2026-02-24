import { animate } from 'motion/mini'

/**
 * scrollIndicator アクションのオプション
 */
export interface ScrollIndicatorOptions {
	/** 色変更の対象セクションID */
	targetSectionId: string
	/** 白い矢印のDOM要素（clip-path制御用） */
	whiteLayer: HTMLElement | SVGSVGElement
}

/**
 * スクロール誘導インジケーター用Svelteアクション。
 * バウンスアニメーションと、ターゲットセクションとの重なりに応じた色分割を実装。
 *
 * @example
 * <div use:scrollIndicator={{ targetSectionId: 'mission', whiteLayer }}>
 */
export function scrollIndicator(node: HTMLElement, options: ScrollIndicatorOptions): { destroy: () => void } {
	const { targetSectionId, whiteLayer } = options

	node.style.willChange = 'transform'

	// バウンスアニメーション（落下→バウンド→停止→持ち上げループ）
	// より細かくリアルな物理的バウンスを再現（移動距離: 20px）
	const bounceAnimation = animate(
		node,
		{
			transform: [
				'translateY(0px)', // 開始位置
				'translateY(20px)', // 落下（加速）
				'translateY(3px)', // 1回目バウンス（大きく跳ね返る）
				'translateY(20px)', // 再落下
				'translateY(9px)', // 2回目バウンス（中程度）
				'translateY(20px)', // 再落下
				'translateY(14px)', // 3回目バウンス（小さく）
				'translateY(20px)', // 最終落下
				'translateY(17px)', // 微小バウンス
				'translateY(20px)', // 着地・静止
				'translateY(20px)', // 静止維持
				'translateY(0px)', // 持ち上げ（ループ準備）
			],
		},
		{
			duration: 3.5,
			ease: [0.4, 0, 0.2, 1], // カスタムイージング（落下は速く、バウンスは緩やかに）
			repeat: Infinity,
		},
	)

	// requestAnimationFrameで常に白い矢印のclip-pathを更新
	// バウンスアニメーション中も位置が変わるため、毎フレーム更新が必要
	let animationFrameId: number
	let isRunning = true

	const updateClipPath = () => {
		if (!isRunning) return

		const targetSection = document.querySelector(`#${targetSectionId}`)
		if (targetSection && whiteLayer) {
			const arrowRect = node.getBoundingClientRect()
			const sectionRect = targetSection.getBoundingClientRect()

			// ミッションセクションの上端が矢印のどこと重なっているか計算
			const overlapStart = sectionRect.top - arrowRect.top
			const clipTop = Math.max(0, Math.min(overlapStart, arrowRect.height))

			// clip-pathで白い矢印の表示領域を制限
			// inset(上 右 下 左) - 上からclipTopピクセル分を非表示
			whiteLayer.style.clipPath = `inset(${clipTop}px 0 0 0)`
		}

		animationFrameId = requestAnimationFrame(updateClipPath)
	}

	updateClipPath()

	return {
		destroy() {
			isRunning = false
			cancelAnimationFrame(animationFrameId)
			bounceAnimation.stop()
			node.style.willChange = ''
		},
	}
}
