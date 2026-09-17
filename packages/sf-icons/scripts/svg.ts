import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { type Config, optimize } from "svgo";

export interface SvgFile {
  cwd: string;
  name: string;
}

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
} satisfies Config;

/** Recursively finds every .svg file under `dir`. */
export function scanSvgs(dir: string): SvgFile[] {
  const entries: SvgFile[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const cwd = join(dir, entry.name);
    if (entry.isDirectory()) {
      entries.push(...scanSvgs(cwd));
    }
    else if (entry.name.endsWith(".svg")) {
      entries.push({ cwd, name: entry.name });
    }
  }
  return entries;
}

/** Reads + optimizes one SVG file. Returns the optimized markup as a string. */
export function optimizeSvgFile(file: SvgFile): string {
  const raw = readFileSync(file.cwd, "utf-8");
  const { data } = optimize(raw, { path: file.name, ...SVGO_CONFIG });
  return data;
}
