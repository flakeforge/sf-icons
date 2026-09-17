import perfectionistConfig from "@flakeforge/config/eslint/perfectionist.mjs";
import reactConfig from "@flakeforge/config/eslint/react.mjs";
import stylisticConfig from "@flakeforge/config/eslint/stylistic.mjs";
import typescriptConfig from "@flakeforge/config/eslint/typescript.mjs";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  ...typescriptConfig,
  ...reactConfig,
  ...stylisticConfig,
  ...perfectionistConfig,

  globalIgnores(["node_modules/**", "dist/**"]),
]);
