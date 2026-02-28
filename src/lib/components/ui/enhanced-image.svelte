<script lang="ts">
/**
 * Enhanced Image Component
 * ローカル画像専用 - <enhanced:img> で自動最適化（AVIF/WebP変換、複数サイズ生成）
 * ビルド時に <picture> 要素に変換されます
 */

interface Properties {
	/** アクセシビリティのためのalt属性（必須） */
	alt: string
	/** CSSクラス名 */
	class?: string
	/** デコードヒント */
	decoding?: 'async' | 'auto' | 'sync'
	/** フェッチ優先度ヒント */
	fetchpriority?: 'auto' | 'high' | 'low'
	/** ローディング戦略: 'lazy' | 'eager' */
	loading?: 'eager' | 'lazy'
	/** object-fit CSS プロパティ */
	objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
	/** object-position CSS プロパティ */
	objectPosition?: string
	/** 画像読み込み完了時のコールバック */
	onload?: () => void
	/** レスポンシブ画像のsizes属性 (例: "(min-width: 768px) 50vw, 100vw") */
	sizes?: string
	/** 画像ソース - ローカルimportのみ対応 */
	src: string
}

let { alt, class: className = '', decoding = 'async', fetchpriority = 'auto', loading = 'lazy', objectFit = 'cover', objectPosition = 'center', onload, sizes, src }: Properties = $props()
</script>

<enhanced:img
	{src}
	{alt}
	class={className}
	{loading}
	{sizes}
	style:object-fit={objectFit}
	style:object-position={objectPosition}
	{fetchpriority}
	{decoding}
	{onload}
/>

<style>
/* stylelint-disable-next-line selector-type-no-unknown */
:global(enhanced\:img) {
	display: block;
	max-width: 100%;
	height: auto;
}
</style>
