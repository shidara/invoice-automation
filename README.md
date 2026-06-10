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

## PDF生成について

- 責務分割:
  - `features/invoice/InvoicePdf.tsx` … PDFレイアウト（A4縦）
  - `lib/pdf/renderInvoicePdf.tsx` … フォント登録＋PDFバイナリ生成
  - `app/api/invoice/pdf/route.ts` … POSTで Invoice を受け取りPDFを返すだけ
  - `features/invoice/downloadInvoicePdf.ts` … UI側のBlobダウンロード
- 出力ファイル名: `invoice-{invoiceNumber}.pdf`
- 日本語フォントは Noto Sans JP（OFL）を `public/fonts/` に同梱（`public/fonts/NOTICE.txt` 参照）
- 保存はしない（生成→ダウンロードのみ）

## 状態

- [x] PR1: 初期構築（Next.js / MUI / Storybook / ディレクトリ）
- [x] PR2: Invoice 型・計算・バリデーション
- [x] PR3: 請求書入力フォーム
- [x] PR4: PDF生成 API・ダウンロード（MVP完成）
- [ ] PR5: README 仕上げ
