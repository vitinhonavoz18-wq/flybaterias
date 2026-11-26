import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const config = [
  ...nextVitals,
  ...nextTs,
  { ignores: [".next/**", "out/**", "out-campaigns/**", ".worker/**", ".wrangler/**", "node_modules/**", "next-env.d.ts", "scripts/**"] },
];

export default config;
