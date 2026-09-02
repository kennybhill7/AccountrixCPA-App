/// <reference types="vitest/globals" />
// vitest.config.ts sets `globals: true`; this makes describe/it/expect/vi resolve
// under `tsc --noEmit`. Named *-env (not vitest.d.ts) to avoid colliding with the
// bare `vitest` import specifier under baseUrl resolution.
export {};
