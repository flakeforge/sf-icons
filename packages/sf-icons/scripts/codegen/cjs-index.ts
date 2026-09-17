// cjs-index.ts
export function cjsIndex(componentNames: string[]): string {
  return [
    "\"use strict\";",
    "Object.defineProperty(exports, \"__esModule\", { value: true });",
    ...componentNames.map(
      n => `const ${n} = require("./${n}.cjs");\nexports.${n} = ${n};`,
    ),
    "",
  ].join("\n");
}
