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
 * CSSアニメーションを使用してページ遷移時のエラーを回避。
 *
 * @example
 * <div use:scrollIndicator={{ targetSectionId: 'mission', whiteLayer }}>
 */
export function scrollIndicator(node: HTMLElement, options: ScrollIndicatorOptions): { destroy: () => void } {
	const { targetSectionId, whiteLayer } = options

	node.style.willChange = 'transform'

	// CSSアニメーションでバウンス効果を実現
	// キーフレームを動的に作成
	const keyframeName = `bounce-${Math.random().toString(36).slice(2, 9)}`
	const styleSheet = document.createElement('style')
	styleSheet.textContent = `
		@keyframes ${keyframeName} {
			0% { transform: translateY(0px); }
			5.7% { transform: translateY(20px); }
			11.4% { transform: translateY(3px); }
			17.1% { transform: translateY(20px); }
			22.8% { transform: translateY(9px); }
			28.5% { transform: translateY(20px); }
			34.2% { transform: translateY(14px); }
			40% { transform: translateY(20px); }
			45.7% { transform: translateY(17px); }
			51.4% { transform: translateY(20px); }
			80% { transform: translateY(20px); }
			100% { transform: translateY(0px); }
		}
	`
	document.head.append(styleSheet)

	// アニメーションを適用
	node.style.animation = `${keyframeName} 3.5s cubic-bezier(0.4, 0, 0.2, 1) infinite`

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
			// CSSアニメーションを停止（スタイルシートを削除）
			styleSheet.remove()
			node.style.animation = ''
			node.style.willChange = ''
		},
	}
}
