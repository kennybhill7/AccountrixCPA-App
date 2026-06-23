/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  eslint: {
    // Don't fail `next build` on the ~68 pre-existing `any` lint errors across
    // lib/ (tracked as S1-C12). Lint is still enforced on changed files by the
    // pre-commit hook (lint-staged) and via `npm run lint`. Type-check stays on.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;