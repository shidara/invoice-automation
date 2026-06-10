import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // react-pdf は Node ネイティブ依存を含むためバンドルせず外部化する。
  serverExternalPackages: ['@react-pdf/renderer'],
};

export default nextConfig;
