import { join } from "node:path";
import { defineConfig } from "rolldown";
import { type RolldownOptions } from "rolldown";
import { listComponents } from "./scripts/components.js";
import { emitStatic } from "./scripts/emit-plugin.js";
import { ICONS_DIR, REACT_DIR, ROOT } from "./scripts/paths.js";
import { scanSvgs } from "./scripts/svg.js";

const DIST = join(ROOT, "dist");

export default defineConfig(() => {
  const componentNames = listComponents();
  const svgFiles = scanSvgs(ICONS_DIR);

  // Endi HAMMA component avtomatik input bo'ladi — hardcode yo'q, loop ochiq.
  const input: Record<string, string> = {};
  for (const name of componentNames) {
    input[`react/${name}`] = join(REACT_DIR, `${name}.tsx`);
  }

  return <RolldownOptions>[
    {
      input,
      external: ["react"],
      transform: { jsx: "react" },
      plugins: [emitStatic({ svgFiles, componentNames })],
      // Ikkala format ham kerak: emitStatic() faqat "es" formatda ishlaydi
      // (generateBundle bir marta chaqiriladi), lekin consumer'lar uchun
      // haqiqiy CJS bundle ham chiqishi kerak.
      output: [
        { format: "esm", dir: DIST, entryFileNames: "[name].mjs" },
        { format: "cjs", dir: DIST, entryFileNames: "[name].cjs" },
      ],
    }
  ];
});
