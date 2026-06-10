import type { NextConfig } from 'next';

// GitHub Pages 公開時のみ basePath を付与する（ローカルは素のルートで動かす）。
// リポジトリ名と一致させること: https://shidara.github.io/invoice-automation/
const isGithubPages = process.env.GITHUB_PAGES === 'true';
const basePath = isGithubPages ? '/invoice-automation' : '';

const nextConfig: NextConfig = {
  // 静的サイトとして出力（out/）。サーバー機能・API Route は使わない。
  output: 'export',
  basePath,
  // next/image を静的出力で使えるようにする
  images: { unoptimized: true },
  // クライアントのフォントURL組み立てに使う
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
