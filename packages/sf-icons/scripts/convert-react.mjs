#!/usr/bin/env node

import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { optimize } from "svgo";

const ROOT = import.meta.dirname + "/..";
const ICONS_DIR = join(ROOT, "icons");
const OUT_DIR = join(ROOT, "src", "react");

const SVGO_CONFIG = {
  plugins: [
    { name: "preset-default" },
    { name: "removeAttrs", params: { attrs: "width|height" } },
    { name: "mergePaths", params: { force: true } },
    { name: "removeDimensions" },
    { name: "removeTitle" },
    { name: "sortAttrs" },
  ],
  multipass: false,
  floatPrecision: 3,
};

function scanSvgs(dir) {
  const entries = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      entries.push(...scanSvgs(join(dir, entry.name)));
    }
    else if (entry.name.endsWith(".svg")) {
      entries.push(join(dir, entry.name));
    }
  }
  return entries;
}

function toComponentName(svgPath) {
  const base = basename(svgPath, ".svg");
  const parts = base.split(".");
  const name = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join("");
  return /^[0-9]/.test(name) ? `SF${name}` : name;
}

function extractViewBox(svg) {
  const match = svg.match(/viewBox="([^"]+)"/);
  return match?.[1] ?? "0 0 24 24";
}

function extractInner(svg) {
  const openEnd = svg.indexOf(">");
  const closeStart = svg.lastIndexOf("</svg>");
  if (openEnd === -1 || closeStart === -1) return "";
  return svg.slice(openEnd + 1, closeStart).trim();
}

function toComponent(name, viewBox, inner) {
  return `import * as React from "react";

export interface ${name}Props extends React.SVGProps<SVGSVGElement> {
  /** Icon width and height in pixels. Defaults to 24. */
  size?: number;
}

const ${name}: React.ForwardRefExoticComponent<Omit<${name}Props, "ref"> & React.RefAttributes<SVGSVGElement>> = React.forwardRef<SVGSVGElement, ${name}Props>(
  function ${name}({ size = 24, className, style, ...props }, ref) {
    return (
      <svg
        ref={ref}
        width={size}
        height={size}
        viewBox="${viewBox}"
        fill="currentColor"
        className={className}
        style={style}
        {...props}
      >
        ${inner}
      </svg>
    );
  },
);

export default ${name};
`;
}

function toIndex(names) {
  const lines = [
    "// Generated file. Do not edit.",
    ...names.flatMap(n => [
      `export { default as ${n} } from "./${n}";`,
      `export type { ${n}Props } from "./${n}";`,
    ]),
    "",
  ];
  return lines.join("\n");
}

rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });

const svgFiles = scanSvgs(ICONS_DIR);
const names = new Map();
let total = 0;

for (const svgPath of svgFiles) {
  const raw = readFileSync(svgPath, "utf-8");
  const { data } = optimize(raw, { path: svgPath, ...SVGO_CONFIG });

  const name = toComponentName(svgPath);
  if (names.has(name)) {
    throw new Error(`Duplicate name "${name}" from ${names.get(name)} and ${svgPath}`);
  }
  names.set(name, svgPath);

  const viewBox = extractViewBox(data);
  const inner = extractInner(data);

  writeFileSync(join(OUT_DIR, `${name}.tsx`), toComponent(name, viewBox, inner));
  total++;
}

writeFileSync(join(OUT_DIR, "index.ts"), toIndex([...names.keys()]));

console.log(`✔ converted ${total} SVGs → src/react/`);
