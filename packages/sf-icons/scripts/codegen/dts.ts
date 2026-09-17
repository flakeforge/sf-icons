export function componentDts(name: string): string {
  return `import type { ForwardRefExoticComponent, RefAttributes, SVGProps } from "react";

export interface ${name}Props extends SVGProps<SVGSVGElement> {
  /** Icon width and height in pixels. Defaults to 24. */
  size?: number;
}

declare const ${name}: ForwardRefExoticComponent<Omit<${name}Props, "ref"> & RefAttributes<SVGSVGElement>>;

export default ${name};
`;
}

export function indexDts(componentNames: string[]): string {
  return [
    "// Generated file. Do not edit.",
    ...componentNames.flatMap(n => [
      `export { default as ${n}, type ${n}Props } from "./${n}";`,
    ]),
    "",
  ].join("\n");
}
