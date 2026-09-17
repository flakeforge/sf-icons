import pluginStylistic from "@stylistic/eslint-plugin";

const { rules: stylisticRules } = pluginStylistic.configs.customize({
  indent: 2,
  jsx: true,
  semi: true,
  quotes: "double",
  arrowParens: false,
  blockSpacing: true,
  braceStyle: "stroustrup",
  commaDangle: "always-multiline",
});

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    name: "flake-forge/stylistic",
    plugins: {
      "@stylistic": pluginStylistic,
    },
    rules: stylisticRules,
  },
];