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
  // The content loaders read data/*.json at runtime via a dynamic
  // path.join(process.cwd(), 'data', ...). Next.js file-tracing can't see those
  // dynamic paths, so without this the JSON is NOT bundled into the serverless
  // functions on Vercel and every content route degrades to empty. Force the
  // whole data/ tree (curricula, item bank, cases, knowledge) into every
  // function bundle so lessons, questions, sims, diagnostic, and stats work.
  outputFileTracingIncludes: {
    '/**': ['./data/**/*'],
  },
};

export default nextConfig;
