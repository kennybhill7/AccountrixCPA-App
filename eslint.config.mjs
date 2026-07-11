import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable rules that are too strict for development
      "@typescript-eslint/no-unused-vars": ["warn", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_"
      }],
      // Pre-existing `any` debt: keep visible as warnings (tracked for cleanup)
      // but don't let it mask the errors that MUST block CI (below).
      "@typescript-eslint/no-explicit-any": "warn",
      // shadcn/ui uses empty interfaces that extend a supertype — stylistic only.
      "@typescript-eslint/no-empty-object-type": "warn",
      "react/no-unescaped-entities": "off",
      "@next/next/no-page-custom-font": "off",
      // These are correctness bugs — they must fail lint / CI.
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];

export default eslintConfig;