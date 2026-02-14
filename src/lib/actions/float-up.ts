import { inView, spring } from "motion";
import { animate } from "motion/mini";

/**
 * floatUp アクションのオプション
 */
export interface FloatUpOptions {
	/** スケールのspring bounce値。デフォルト: 0.3 */
	bounce?: number;
	/** 侵入アニメーション時間（秒）。デフォルト: 0.5 */
	durationEnter?: number;
	/** 退出アニメーション時間（秒）。デフォルト: 0.35 */
	durationExit?: number;
	/** 初期スケール値。デフォルト: 0.98 */
	scaleFrom?: number;
	/** トリガーに必要なビューポート内表示率（0-1）。デフォルト: 0.3 */
	threshold?: number;
	/** Y軸移動量（px）。正の値 = 下から開始。デフォルト: 6 */
	translateY?: number;
}

/**
 * スクロールトリガーの「ふわっと浮き上がる」アニメーション用Svelteアクション。
 * ビューポートへの侵入・退出時にフェードイン、translateY、スケールアニメーションを適用。
 *
 * @example
 * <h2 use:floatUp>タイトル</h2>
 * <p use:floatUp={{ translateY: 10 }}>コンテンツ</p>
 */
export function floatUp(
	node: HTMLElement,
	options: FloatUpOptions = {},
): { destroy: () => void } {
	const {
		bounce = 0.3,
		durationEnter = 0.5,
		durationExit = 0.35,
		scaleFrom = 0.98,
		threshold = 0.3,
		translateY = 6,
	} = options;

	// 初期状態: 不可視、下にオフセット、やや縮小
	// 個別のCSSプロパティを使用（Motionが個別にアニメーション可能）
	node.style.opacity = "0";
	node.style.scale = String(scaleFrom);
	node.style.translate = `0 ${translateY}px`;
	node.style.willChange = "scale, translate, opacity";

	// MotionのinViewを使用してビューポート監視開始
	const stopObserver = inView(
		node,
		() => {
			// 侵入アニメーション: opacity と translate (easing)
			animate(
				node,
				{
					opacity: 1,
					translate: "0 0",
				},
				{
					duration: durationEnter,
					ease: [0.25, 0.1, 0.25, 1],
				},
			);

			// 侵入アニメーション: scale (spring)
			animate(
				node,
				{ scale: 1 },
				{
					bounce,
					duration: durationEnter * 1.5,
					type: spring,
				},
			);

			// 退出アニメーション: 初期状態に戻る
			return () => {
				animate(
					node,
					{
						opacity: 0,
						translate: `0 ${translateY}px`,
					},
					{
						duration: durationExit,
						ease: [0.25, 0.1, 0.25, 1],
					},
				);

				animate(
					node,
					{ scale: scaleFrom },
					{
						bounce: bounce * 0.5,
						duration: durationExit * 1.2,
						type: spring,
					},
				);
			};
		},
		{ amount: threshold },
	);

	return {
		destroy() {
			stopObserver();
			node.style.willChange = "";
			node.style.scale = "";
			node.style.translate = "";
		},
	};
}
