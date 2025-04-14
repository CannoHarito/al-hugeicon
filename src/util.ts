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
export const clamp = (n: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, n));
export const toRGB = ({ h = 360, s = 0.5, v = 1 }: Partial<HSV> = {}) => {
  h = (h < 0 ? h % 360 + 360 : h) % 360 / 60;
  s = clamp(s, 0, 1);
  v = clamp(v, 0, 1);
  const [r, g, b] = [5, 3, 1].map((n) =>
    Math.round(
      (v - clamp(2 - Math.abs(2 - (h + n) % 6), 0, 1) * s * v) * 255,
    )
  );
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, "0")}`;
};
export interface HSV {
  h: number;
  s: number;
  v: number;
}
export const toHSV = (rgb: string = "#ff8080"): HSV => {
  const rgbNum = parseInt(rgb.replaceAll(/[^a-f\d]/ig, ""), 16),
    [r, g, b] = [16, 8, 0].map((n) => rgbNum >> n & 0xff),
    max = Math.max(r, g, b),
    diff = max - Math.min(r, g, b),
    i = [r, g, b].indexOf(max),
    [a1, a2] = [r, g, b, r, g].slice(i + 1),
    v = max / 255,
    s = max ? diff / max : 0,
    h = s ? ((a1 - a2) / diff * 60 + 120 * i + 360) % 360 : 0;
  return { h, s, v };
};
