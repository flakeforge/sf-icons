export function esmIndex(componentNames: string[]): string {
  return [
    "// Generated file. Do not edit.",
    ...componentNames.map(n => `export { default as ${n} } from "./${n}.mjs";`),
    "",
  ].join("\n");
}
