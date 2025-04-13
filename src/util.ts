export const throttle = (func: () => void, timeout = 100) => {
  let awaiting = false;
  let cooltimePromise = Promise.resolve();
  return async () => {
    if (awaiting) return;
    awaiting = true;
    await cooltimePromise;
    awaiting = false;
    func();
    cooltimePromise = new Promise((r) => setTimeout(() => r(), timeout));
  };
};
export interface Huge {
  name: string;
  draw: (options: Partial<DrawOptions>) => string;
  parts: string[];
}
export interface DrawOptions {
  parts: string[];
  color: FormData;
  viewbox: FormData;
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
export function getViewboxString(formdata: FormData, { svgSize = 512 } = {}) {
  const w = Math.round((+(formdata.get("size") || "0") + 100) * svgSize / 100);
  const cx = Math.round(+(formdata.get("x") || "0") * svgSize / 100);
  const cy = Math.round(+(formdata.get("y") || "0") * svgSize / 100);
  const x = Math.round(cx - w / 2);
  const y = Math.round(cy - w / 2);
  return [x, y, w, w].join(" ");
}
