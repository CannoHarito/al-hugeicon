export interface DrawOptions {
  parts: string[];
  color: FormData;
  style: string;
}
export const colorNames = [
  "bgcolor",
  "bodycolor",
  "strokecolor",
  "hugecolor",
  "blackcolor",
  "greycolor",
];
export function getStyleString(formdata: FormData) {
  const styles: string[] = [...formdata]
    .filter(([k]) => colorNames.includes(k))
    .map(([k, v]) => `--${k}:${v};`);
  if (!formdata.has("bgtransparent")) {
    styles.push(`background-color:var(--bgcolor, #fff);`);
  }
  return styles.join("");
}
