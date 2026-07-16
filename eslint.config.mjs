import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  {
    rules: {
      "no-undef": "error", // 선언되지 않은 변수 사용 금지
      "no-unused-vars": "error", // 선언 후 사용하지 않는 변수/import 금지
      "no-var": "error", // var 대신 let/const 사용
      "prefer-const": "error", // 재할당 없는 변수는 const로 선언
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
