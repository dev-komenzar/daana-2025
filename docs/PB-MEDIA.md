# pb-media:// 画像参照方式

> 対象: 本プロジェクトの開発者
> 前提: PocketBase をメディアストレージとして使用し、ニュース/プロジェクトの本文に画像を埋め込む仕組みを理解していること

## 概要

`pb-media://{mediaId}` は、**PocketBase に保存されたメディアファイルを環境非依存で参照するための内部プロトコル**である。絶対URL（`https://pb.samgha.org/api/files/...`）をHTML内に埋め込む代わりに、このプロトコル参照を使うことで以下の問題を解決する。

### 解決する問題

| 問題         | 絶対URL方式                                              | pb-media:// 方式                   |
| ------------ | -------------------------------------------------------- | ---------------------------------- |
| 環境間の移植 | dev/staging/prod でURLが異なりコンテンツが壊れる         | 環境非依存、どの環境でも正しく表示 |
| ドメイン変更 | 保存済み全コンテンツのURLを修正する必要がある            | コード側の解決ロジックが自動追従   |
| 内部URL漏洩  | `PB_URL`（Docker内部アドレス）がブラウザに露出し表示不能 | 表示時に必ず公開URLに解決          |

### なぜ必要か

本番環境では PocketBase が `PB_URL=http://daana-pb:8090` で SvelteKit サーバーと通信する一方、ブラウザは `PB_PUBLIC_URL=https://pb.samgha.org` でアクセスする必要がある。`pb-media://` はこの **内部/公開URLの二重性を吸収する抽象層**として機能する。

---

## データフロー

### 画像挿入（CMS 編集画面）

```
[メディアピッカー]
     │
     │ ユーザーが画像を選択
     ▼
image-picker-modal.svelte
     │
     │ editor.setImage({ src: "pb-media://{mediaId}" })
     ▼
TipTap エディタ（HTML 内に <img src="pb-media://abc123"> が生成される）
```

### 保存

```
[フォーム送信]
     │
     ▼
+page.server.ts (form action)
     │
     ├─ convertAbsolutePbUrlsToReferences()  ← 既存の絶対URLを pb-media:// に正規化
     ├─ sanitizeHtml()                       ← pb-media: プロトコルは許可済み
     └─ pb.collection('news').update()       ← pb-media:// のまま PocketBase に保存
```

### 表示（CMS 編集画面）

```
[ページロード]
     │
     ▼
+page.server.ts (load function)
     │
     ├─ PocketBase からレコード取得 (content には pb-media:// が含まれる)
     ├─ convertAbsolutePbUrlsToReferences()  ← 古い絶対URLも pb-media:// に正規化
     ├─ resolvePbMediaReferences(pb, pbPublicUrl)  ← pb-media:// → 公開URL に解決
     └─ 解決済みHTMLをクライアントに返却
```

### 表示（公開ページ）

```
[公開ページ]
     │
     ▼
PocketBaseNewsRepository
     │
     ├─ getNewsById() / getNewsByOriginalId()
     ├─ resolvePbMediaReferences(pb, baseUrl)  ← pb-media:// → 公開URL に解決
     └─ 解決済みHTMLをクライアントに返却
```

---

## 実装位置

### コアロジック

| ファイル                             | 役割                                                                        |
| ------------------------------------ | --------------------------------------------------------------------------- |
| `src/lib/pb/rewrite-content-urls.ts` | `resolvePbMediaReferences()` / `convertAbsolutePbUrlsToReferences()` の実装 |
| `src/lib/pb/client.ts`               | `pbPublicUrl` のエクスポート（公開URLの単一ソース）                         |

### 消費側

| ファイル                                            | 使用関数                            | タイミング            |
| --------------------------------------------------- | ----------------------------------- | --------------------- |
| `src/lib/news/infra/pb-repository.ts`               | `resolvePbMediaReferences`          | 公開ページ表示時      |
| `src/routes/cms/news/[id]/edit/+page.server.ts`     | 両方                                | 編集画面ロード / 保存 |
| `src/routes/cms/news/new/+page.server.ts`           | `convertAbsolutePbUrlsToReferences` | 新規作成保存          |
| `src/routes/cms/projects/[id]/edit/+page.server.ts` | 両方                                | 編集画面ロード / 保存 |
| `src/routes/cms/projects/new/+page.server.ts`       | `convertAbsolutePbUrlsToReferences` | 新規作成保存          |

### 挿入側

| ファイル                                       | 役割                                       |
| ---------------------------------------------- | ------------------------------------------ |
| `src/lib/cms/editor/image-picker-modal.svelte` | 画像選択時に `pb-media://{item.id}` を挿入 |

### 許可設定

| ファイル                  | 設定内容                                                |
| ------------------------- | ------------------------------------------------------- |
| `src/lib/cms/sanitize.ts` | DOMPurify の `ALLOWED_URI_REGEXP` に `pb-media:` を追加 |

---

## API 関数リファレンス

### `resolvePbMediaReferences(html, pb, baseUrl): Promise<string | undefined>`

HTML 文字列内の `pb-media://{mediaId}` を、PocketBase からメディアレコードを取得して実際のファイルURLに解決する。

```ts
// 入力:  '<img src="pb-media://abc123" alt="写真">'
// 出力:  '<img src="https://pb.samgha.org/api/files/media/abc123/file.webp" alt="写真">'
```

- `html`: 変換対象のHTML文字列
- `pb`: PocketBase クライアント（`collection('media').getOne(id)` が呼べること）
- `baseUrl`: 解決に使うベースURL（通常は `pbPublicUrl`）

### `convertAbsolutePbUrlsToReferences(html): string | undefined`

HTML 文字列内の絶対PBファイルURLを `pb-media://` 参照に変換する。古いコンテンツのマイグレーション用。

```ts
// 入力:  '<img src="http://daana-pb:8090/api/files/media/abc123/file.webp">'
// 出力:  '<img src="pb-media://abc123">'
```

---

## 注意事項

### メディアピッカーのサムネイルは pb-media:// ではない

画像ピッカーに表示されるサムネイル（`thumbUrl`）は**絶対URLのまま**である。`pb-media://` はブラウザが画像として解釈できないため、UI表示用のサムネイルは従来通り `buildPbFileUrl()` で生成した実URLを使う。

```
thumbUrl: buildPbFileUrl('media', r.id, r.file, { thumb: '200x200' })  // ← 実URL
src (挿入時): pb-media://${item.id}                                     // ← プロトコル参照
```

### PB_PUBLIC_URL 環境変数

`pb-media://` 方式によりコンテンツ内の画像は `PB_PUBLIC_URL` 未設定でも表示できるが、メディアピッカーのサムネイル表示には `PB_PUBLIC_URL` が必須。本番環境では必ず設定すること。

```bash
# Coolify の環境変数
PB_URL=http://daana-pb:8090           # サーバー→PB の内部通信用
PB_PUBLIC_URL=https://pb.samgha.org   # ブラウザに公開するURL（ファイル配信用）
```

### メディアレコード削除時の挙動

`resolvePbMediaReferences` はメディアレコードが見つからない場合、`pb-media://` 参照を**そのまま残す**。ブラウザ上では画像が表示されないが、エラーにはならない。該当メディアを再アップロードすれば自動的に復旧する。

### マイグレーションスクリプトとの関係

`scripts/lib/news-sync.ts` は microCMS からの移行時に `pb-media://` 参照を生成する。この方式は移行時点から一貫して使われている。

---

## 関連ドキュメント

- [CMS-MIGRATION.md](./CMS-MIGRATION.md) — CMS 運用手順書
- [CLAUDE.md](../CLAUDE.md) — エージェント運用ルール
