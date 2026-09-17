import type { Plugin } from "rolldown";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { cjsIndex } from "./codegen/cjs-index.js";
import { componentDts, indexDts } from "./codegen/dts.js";
import { esmIndex } from "./codegen/esm-index.js";
import { optimizeSvgFile, type SvgFile } from "./svg.js";

interface EmitStaticOptions {
  svgFiles: SvgFile[];
  componentNames: string[];
}

let total = 0;

/** Har bir output formatida (esm/cjs) bir marta ishlaydigan rolldown plugin.
 *  Faqat generatsiya funksiyalarini chaqiradi va natijani diskka yozadi —
 *  mantiq bu yerda emas, yuqoridagi sof funksiyalarda. */
export function emitStatic({ svgFiles, componentNames }: EmitStaticOptions): Plugin {
  return {
    name: "flake-forge/sf-icons/emit-static",
    async generateBundle(outputOptions) {
      if (outputOptions.format !== "es") return;

      const dist = outputOptions.dir!;
      const distReact = join(dist, "react");
      const distSvg = join(dist, "svg");
      mkdirSync(distSvg, { recursive: true });
      mkdirSync(distReact, { recursive: true });

      for (const file of svgFiles) {
        writeFileSync(join(distSvg, file.name), optimizeSvgFile(file));
      }

      for (const name of componentNames) {
        writeFileSync(join(distReact, `${name}.d.ts`), componentDts(name));
      }

      writeFileSync(join(distReact, "index.d.ts"), indexDts(componentNames));
      writeFileSync(join(distReact, "index.mjs"), esmIndex(componentNames));
      writeFileSync(join(distReact, "index.cjs"), cjsIndex(componentNames));

      writeFileSync(join(dist, "count.txt"), total.toString());
      total++;
    },
  };
}
