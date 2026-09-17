import { readdirSync } from "node:fs";
import { REACT_DIR } from "./paths.js";

/** Component nomlarini `src/react/*.tsx` fayllaridan topadi — hardcode yo'q. */
export function listComponents(): string[] {
  return readdirSync(REACT_DIR)
    .filter(f => f.endsWith(".tsx"))
    .map(f => f.replace(/\.tsx$/, ""));
}
