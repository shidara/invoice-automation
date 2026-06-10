# invoice-automation

請求書を入力 → PDF生成 → ダウンロードできるWebアプリ（個人・副業利用想定）。

現時点では保存・認証・LINE連携などは持たず、「入力してPDFを作る」ことに集中したMVPです。

## 技術スタック

- Next.js (App Router) / TypeScript
- Material UI (MUI) — Material Design 3 ベース
- Storybook（コンポーネント開発・確認用）
- PDF生成: `@react-pdf/renderer`（API Route で生成、ブラウザダウンロード）

## ディレクトリ構成

```
app/         画面・API Route
features/    ドメイン機能（invoice など）
components/  共通UI
lib/         共通処理（theme など）
stories/     Storybook
styles/      最小限のCSS
docs/        設計メモ
public/      静的アセット
```

## セットアップ

パッケージマネージャは **yarn** を使います。

```bash
yarn install
yarn dev          # http://localhost:3000
yarn storybook    # http://localhost:6006
```

## スクリプト

| コマンド | 内容 |
| --- | --- |
| `yarn dev` | 開発サーバー起動 |
| `yarn build` | 本番ビルド |
| `yarn storybook` | Storybook 起動 |
| `yarn build-storybook` | Storybook ビルド |
| `yarn lint` | ESLint |

## 状態

- [x] PR1: 初期構築（Next.js / MUI / Storybook / ディレクトリ）
- [ ] PR2: Invoice 型・計算・バリデーション
- [ ] PR3: 請求書入力フォーム
- [ ] PR4: PDF生成 API・ダウンロード
- [ ] PR5: README 仕上げ
