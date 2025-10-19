# ほうどう寺サイトプロジェクト2025

ほうどう寺のWEBサイト2025年版です。

## 技術選定

- Svelte, SvelteKit
- TypeScript
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
 src: local('Noto Sans JP Light'), url('/fonts/NotoSansJP-Light.ttf') format("truetype");
 font-display: swap;
}
```
