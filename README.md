# ほうどう寺サイトプロジェクト2025

ほうどう寺のWEBサイト2025年版です。

## 技術選定

- Svelte, SvelteKit
- TypeScript
- Prettier
- ESLint
- StyleLint
- スタイル：CSS

## 開発にかかわるには

ローカルにリポジトリをクローンし、

```shell
pnpm install
pnpm dev --open
```

フレームワークについては[Svelte • Web development for the rest of us](https://svelte.jp/)を見てください。

## Depoy

Githubにリポジトリを置き、Vercelにデプロイします。

## フォント

フォントプラスのwebフォントを利用している。英字のゴシックにはFuturaを指定。日本語ゴシックにはNoto Sans JPを指定。

### 日本語ゴシックにはNoto Sans JP

Googleフォントからダウンロードしたフォントを`static/fonts/`に配置する。~~可変フォントを使用している。~~可変フォントの使用はやめた。フォントプラスに合わせてフォント名でweightを指定する方針に定める。

```css
/* app.css */
@font-face {
	font-family: 'Noto Sans JP Light';
	font-style: normal;
	font-weight: 300;
	src:
		local('Noto Sans JP Light'),
		url('/fonts/NotoSansJP-Light.ttf') format('truetype');
	font-display: swap;
}
```

## アニメーション

### floatUp アクション

スクロールトリガーの「ふわっと浮き上がる」アニメーション用Svelteアクション。ビューポートへの侵入・退出時にフェードイン、translateY、スケールアニメーションを適用する。

#### 基本的な使い方

```svelte
<script>
	import { floatUp } from '$lib/actions'
</script>

<h2 use:floatUp>タイトル</h2><p use:floatUp>コンテンツ</p>
```

#### オプション

| オプション      | 型     | デフォルト | 説明                                        |
| --------------- | ------ | ---------- | ------------------------------------------- |
| `translateY`    | number | 6          | Y軸移動量（px）。正の値 = 下から開始        |
| `scaleFrom`     | number | 0.98       | 初期スケール値                              |
| `durationEnter` | number | 0.5        | 侵入アニメーション時間（秒）                |
| `durationExit`  | number | 0.35       | 退出アニメーション時間（秒）                |
| `threshold`     | number | 0.3        | トリガーに必要なビューポート内表示率（0-1） |
| `bounce`        | number | 0.3        | スケールのspring bounce値                   |

#### カスタマイズ例

```svelte
<!-- より大きな移動量とスケール変化 -->
<p use:floatUp={{ translateY: 10, scaleFrom: 0.95 }}>...</p>

<!-- より弾むアニメーション -->
<div use:floatUp={{ bounce: 0.5 }}>...</div>

<!-- ゆっくりしたアニメーション -->
<section use:floatUp={{ durationEnter: 0.8, durationExit: 0.5 }}>...</section>
```
