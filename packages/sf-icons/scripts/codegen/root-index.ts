export function rootIndex(format: "cjs" | "dts" | "esm"): string {
  if (format === "cjs") {
    return [
      "\"use strict\";",
      "Object.defineProperty(exports, \"__esModule\", { value: true });",
      "exports.SFReact = require(\"./react/index.cjs\");",
      "",
    ].join("\n");
  }

  return "export * as SFReact from \"./react\";\n";
}
