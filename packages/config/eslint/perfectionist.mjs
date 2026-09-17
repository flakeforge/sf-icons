import pluginPerfectionist from "eslint-plugin-perfectionist";

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    name: "flake-forge/perfectionist",
    plugins: {
      perfectionist: pluginPerfectionist,
    },
    rules: {
      // Export sorting
      "perfectionist/sort-exports": ["error", { order: "asc", type: "natural" }],

      // Import sorting
      "perfectionist/sort-imports": ["error", {
        order: "asc",
        type: "natural",
        newlinesBetween: "ignore",
        groups: [
          // 1. Type imports (internal subpath first)
          "type",
          "type-internal",
          ["type-parent", "type-sibling", "type-index"],

          // 2. Value imports
          "builtin",
          "external",
          "subpath",
          "internal",
          ["parent", "sibling", "index"],

          // 3. Side effects
          "side-effect",
          "unknown",
        ],
      }],

      // Named imports/exports sorting: { b, a } → { a, b }
      "perfectionist/sort-named-imports": ["error", { order: "asc", type: "natural" }],
      "perfectionist/sort-named-exports": ["error", { order: "asc", type: "natural" }],
    },
  },
];