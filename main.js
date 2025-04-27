// src/util.ts
var throttle = (func, timeout = 100) => {
  let awaiting = false;
  let cooltimePromise = Promise.resolve();
  return async () => {
    if (awaiting)
      return;
    awaiting = true;
    await cooltimePromise;
    awaiting = false;
    func();
    cooltimePromise = new Promise((r) => setTimeout(() => r(), timeout));
  };
};
var defaultColor = {
  bgcolor: "#ffffff",
  bodycolor: "#cccccc",
  strokecolor: "#323232",
  hugecolor: "#80ffa6",
  blackcolor: "#323232",
  greycolor: "#6e6e6e"
};
var getColor = (...colors) => Object.assign({}, defaultColor, ...colors);
var colorNames = Object.keys(defaultColor);
function getStyleString(formdata) {
  const styles = [...formdata].filter(([k]) => colorNames.includes(k)).map(([k, v]) => `--${k}:${v};`);
  if (!formdata.has("bgtransparent")) {
    styles.push(`background-color:var(--bgcolor, #fff);`);
  }
  return styles.join("");
}
function getViewboxString(formdata, { svgSize = 512 } = {}) {
  const w = Math.round((+(formdata.get("size") || "0") + 100) * svgSize / 100);
  const cx = Math.round(+(formdata.get("x") || "0") * svgSize / 100);
  const cy = Math.round(+(formdata.get("y") || "0") * svgSize / 100);
  const x = Math.round(cx - w / 2);
  const y = Math.round(cy - w / 2);
  return [x, y, w, w].join(" ");
}
var clamp = (n, min = 0, max = 1) => Math.min(max, Math.max(min, n));
var toRGB = ({ h = 360, s = 0.5, v = 1 } = {}) => {
  h = (h < 0 ? h % 360 + 360 : h) % 360 / 60;
  s = clamp(s, 0, 1);
  v = clamp(v, 0, 1);
  const [r, g, b] = [5, 3, 1].map(
    (n) => Math.round(
      (v - clamp(2 - Math.abs(2 - (h + n) % 6), 0, 1) * s * v) * 255
    )
  );
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, "0")}`;
};
var toHSV = (rgb = "#ff8080") => {
  const rgbNum = parseInt(rgb.replaceAll(/[^a-f\d]/ig, ""), 16), [r, g, b] = [16, 8, 0].map((n) => rgbNum >> n & 255), max = Math.max(r, g, b), diff = max - Math.min(r, g, b), i = [r, g, b].indexOf(max), [a1, a2] = [r, g, b, r, g].slice(i + 1), v = max / 255, s = max ? diff / max : 0, h = s ? ((a1 - a2) / diff * 60 + 120 * i + 360) % 360 : 0;
  return { h, s, v };
};

// src/orbio.ts
var name = "orbio";
var parts = [
  ["hoshia", "hoshib", "hearta", "sumi"],
  ["tunoa", "tunob", "tunoc", "tunod", "drilla", "drillb"],
  ["ashia", "ashib"],
  ["yunicap", "dainsleif", "twinebifry", "arayasearch"]
].flat();
var color = {
  bodycolor: "#cccccc",
  strokecolor: "#323232",
  hugecolor: "#80ffa6"
};
var draw = ({
  parts: parts3 = ["hoshia", "tunoa", "tunob", "tunoc", "tunod", "ashia", "ashib"],
  color: color3,
  viewbox,
  style
} = {}) => {
  const svgStyle = color3 ? getStyleString(color3) : "";
  const viewboxString = viewbox ? getViewboxString(viewbox) : "-256 -256 512 512";
  const bodycolor = "var(--bodycolor, #ccc)", strokecolor = "var(--strokecolor, #323232)", hugecolor = "var(--hugecolor, #80ffa6)", blackcolor = "var(--blackcolor, #323232)", greycolor = "var(--greycolor, #6e6e6e)";
  const svgChildren = [];
  const defsChildren = [];
  defsChildren.push(`<radialGradient id="eyeG">
  <stop stop-color="#fff" offset=".5"/>
  <stop stop-color="#000" offset="1"/>
</radialGradient>
<mask id="eyeM">
  <circle r="10" fill="url(#eyeG)"/>  
</mask>
<path id="bodyO" d="m-30-51-21 37h-99v28h99l22 37h59l21-37h99v-28h-99l-21-37z"/>
<clipPath id="bodyClip" >
  <circle r="136"/>
</clipPath>`);
  svgChildren.push(`<g stroke="${strokecolor}" stroke-linejoin="round" stroke-width="4">
  <circle r="136" fill="${bodycolor}" stroke="none"/>
  <g clip-path="url(#bodyClip)">
    <use href="#bodyO" stroke-width="12"/>
    <use href="#bodyO" fill="${blackcolor}" stroke="${greycolor}"/>
  </g>
  <circle r="136" fill="none"/>
</g>
<g fill="${hugecolor}">
  <circle id="eyeA" transform="translate(0 -20)" r="10" mask="url(#eyeM)"/>
  <use id="eyeB" transform="rotate(240)" href="#eyeA"/>
  <use id="eyeC" transform="rotate(120)" href="#eyeA"/>
</g>`);
  if (parts3.includes("sumi")) {
    svgChildren.push(`<g fill="none" stroke="${strokecolor}" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
  <path id="sumiP" d="m-126 45h2c7-3 10-7 16-15 3-4 42-4 46 0 8 8 18 26 26 34 4 4 68 4 72 0 8-8 18-26 26-34 4-4 43-4 46 0 6 8 9 12 16 15h2"/>
  <use transform="scale(1,-1)" href="#sumiP"/>
  <circle id="sumiC" cx="-60" cy="60" r="6"/>
  <use transform="scale(-1)" href="#sumiC"/>
</g>`);
  }
  const ashiA = `<g id="ashiA" transform="translate(126)" fill="${bodycolor}" stroke="${strokecolor}" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
  <ellipse rx="12" ry="38" fill="${greycolor}"/>
  <path d="m2-19 41-12v59l-41-9c-3-12-3-25 0-38z"/>
  <path d="m53-172c-8-16-18-21-28-24-4 20-11 37-20 52 12 12 28 116 32 144s4 132 4 132c22 17 26 30 32 44 16-14 21-29 24-44 0-20 4-85-8-156-11-66-24-128-36-148z"/>
  <path d="m37-16c23 3 51 13 52-8m8 156c-4 12-8 20-56 0m12-304c-8-5-10-19-48 28m20-52c41 45 64 192 64 280 0 32 4 64-16 92" fill="none"/>
</g>`;
  const ashiB = `<use transform="scale(-1,1)" href="#ashiA"/>`;
  if (parts3.includes("ashia"))
    svgChildren.push(ashiA);
  else if (parts3.includes("ashib"))
    defsChildren.push(ashiA);
  if (parts3.includes("ashib"))
    svgChildren.push(ashiB);
  if (parts3.some((s) => s.startsWith("hoshi"))) {
    defsChildren.push(`<g id="hoshi">
  <path d="m0-25 10.3 10.8 13.5 6.5-7.2 13.1-1.9 14.8-14.7-2.7-14.7 2.7-1.9-14.8-7.1-13.1 13.5-6.4z" stroke="${strokecolor}" stroke-linejoin="round" stroke-width="4"/>
  <path id="hoshiP" d="m-4 17h8l-4-13z" fill="${strokecolor}"/>
  <use transform="rotate(-72)" href="#hoshiP"/>
  <use transform="rotate(216)" href="#hoshiP"/>
  <use transform="rotate(144)" href="#hoshiP"/>
  <use transform="rotate(72)" href="#hoshiP"/>
</g>`);
    if (parts3.includes("hoshia")) {
      svgChildren.push(
        `<use transform="translate(80 56) rotate(15)" fill="${hugecolor}" href="#hoshi"/>`
      );
    }
    if (parts3.includes("hoshib")) {
      svgChildren.push(
        `<use transform="translate(-80 -48) rotate(30)" fill="${hugecolor}" href="#hoshi"/>`
      );
    }
  }
  if (parts3.includes("hearta")) {
    svgChildren.push(`<g transform="translate(84 56)" fill="${hugecolor}" stroke="${strokecolor}" stroke-linejoin="round" stroke-width="5" paint-order="stroke">
  <path d="m-13 2c-4-4-5-10-3-14 1-3 5-4 8-3s8 6 8 6 5-6 8-6c3-1 6 1 8 3 2 4 1 10-3 14-3 3-13 9-13 9s-10-6-13-9z"/>
</g>`);
  }
  if (parts3.some((s) => s.startsWith("tuno"))) {
    defsChildren.push(`<g id="tuno" stroke-linejoin="round" stroke-width="4">
  <path d="m-38 0c6 2 22 4 22 4l12 8c2.67 1.33 5.33 1.33 8 0l12-8s16-2 22-4c3.16-1.05-6-8-6-8-16-20-24-36-28-56 0 0-1-2-4-2s-4 2-4 2c-4 20-12 36-28 56 0 0-9.16 6.95-6 8z" fill="${hugecolor}" stroke="${strokecolor}"/>
  <path id="tunoP" d="m-13 4c4.98-12.8 6.88-28.5 9-44-4 15-9 29-15 43" fill="${strokecolor}" stroke="${strokecolor}" stroke-width="2"/>
  <use transform="scale(-1,1)" href="#tunoP"/>
</g>`);
    if (parts3.includes("tunoa")) {
      svgChildren.push(
        `<use transform="translate(76,-96) rotate(32)" href="#tuno"/>`
      );
    }
    if (parts3.includes("tunob")) {
      svgChildren.push(
        `<use transform="translate(-76,-96) rotate(-32)" href="#tuno"/>`
      );
    }
    if (parts3.includes("tunoc")) {
      svgChildren.push(
        `<use transform="translate(76,100) rotate(148)" href="#tuno"/>`
      );
    }
    if (parts3.includes("tunod")) {
      svgChildren.push(
        `<use transform="translate(-76,100) rotate(212)" href="#tuno"/>`
      );
    }
  }
  if (parts3.some((s) => s.startsWith("drill"))) {
    defsChildren.push(`<g id="drill" fill="${greycolor}" stroke="${strokecolor}" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
  <path d="m28-2-27-63-1-2-1 2-28 63c13 10 45 10 57 0z"/>
  <path d="m-11-42c7-1 14-4 17-8m-26 29c12 0 28-6 33-14m-36 36c19-3 36-8 43-19" fill="none"/>
</g>`);
  }
  if (parts3.includes("drilla")) {
    svgChildren.push(
      `<use transform="translate(76,-96) rotate(28)" href="#drill"/>`
    );
  }
  if (parts3.includes("drillb")) {
    svgChildren.push(
      `<use transform="translate(-76,-96) rotate(-28)" href="#drill"/>`
    );
  }
  if (parts3.includes("yunicap")) {
    svgChildren.push(`<g fill-rule="evenodd" stroke="#13258a" stroke-linejoin="round">
  <path d="m132-108c-1 11 0 18-16 22-30 11-100-28-116-28s-68 8-111 10c-12-5-20-18-10-40 8-16 64-41 119-36 62 2 136 50 134 72z" fill="#fff" stroke-width="4"/>
  <path d="m-114-105 12-1c26-2 28-9 78-16s115 39 143 36v10c-25 6-93-39-143-33s-48 15-78 17l-12 1z" fill="#f6cc74" stroke-width="6"/>
  <g transform="translate(0,2.4)" fill="#f6cc74" stroke-linecap="round" stroke-width="2">
    <path d="m109-86c21 38 28 72 32 111l-5 6c-5-39-9-79-34-117"/>
    <path d="m102-86c-14 40-16 77-15 116l7 4c-3-39-3-78 15-120"/>
    <path d="m102-86c9 13 10 36 7 43s-16 4-24-6c-7-10 16-31 16-31m10 39c0 10-22 8-32-6s22-41 22-41"/>
    <path d="m105-88c1 16 8 43 11 48 4 6 25 7 29-4s-39-38-39-38m-5-6c0 18 8 45 12 52 4 8 32 8 37-7 6-15-45-45-45-45"/>
  </g>
</g>`);
  }
  if (parts3.includes("dainsleif")) {
    svgChildren.push(`<g stroke="${strokecolor}" stroke-linejoin="round" stroke-linecap="round" stroke-width="2" transform="translate(76,-124) rotate(32)">
  <path d="m4-32v-56h-8v56zm0 24 4 4 22-22 4-2 2-6-2-2-6 2-2 4z" fill="${greycolor}"/>
  <path d="m-12-32-12 40 2 8h14l4 32h8l4-32h14l2-8h-16v-40zm16-56 3-4-5-11h-4l-5 11 3 4z" fill="${greycolor}"/>
  <path d="m25 0 27 4-4 40-24 16-4 8c-14 2-26 2-40 0l-4-8-24-16-4-40 27-4 9 8 4 12-4 2 7 26h4l5 4 4-4h5l7-26-4-2 4-12 9-8" fill="#a9a071"/>
  <circle r="14" stroke-width="7"/>
  <circle r="14" stroke="${greycolor}" fill="#76fbff" stroke-width="3"/>
  <path d="m7-8-7 4-7-4v16l7-4 7 4m-7-16v16" stroke="${greycolor}" stroke-width="3.8" fill="none"/>
  <path d="m7-8-7 4-7-4v16l7-4 7 4m-7-16v16" stroke="#fff" stroke-width="3" fill="none"/>
  <path d="m0 52 4 10-4 7m-5-90c0 2-1 3-3 3s-3-1-3-3 1-3 3-3 3 1 3 3zm29 64c0 2 1 3 3 3s3-1 3-3-1-3-3-3-3 1-3 3zm7-41s-2 23-1 23 8-22 8-22m-62 40c0 2-1 3-3 3s-3-1-3-3 1-3 3-3 3 1 3 3zm-7-41s2 23 1 23-8-22-8-22" fill="none"/>
  <path d="m-21 71-6 4-6-1-7 5m60-8 12 4h7l7 4m-69-11h-7l-5-3-9 1m69 2 8-2 8 1 5-2" fill="none"/>
</g>`);
  }
  if (parts3.includes("twinebifry")) {
    svgChildren.push(`<g id="ebifryA" stroke-linejoin="round" stroke-width="3" stroke="${strokecolor}">
  <path d="m143-150s10-53-1-68c-4-5-10-5-14-1-6 6-6 33-6 33s-17-15-22-8c-3 2-5 11-3 17 7 22 41 34 41 34z" fill="#ff9f3f"/>
  <path d="m120-191c11 10 19 25 23 41l-5 7c-7-15-16-33-18-48z" fill="#ff9f3f"/>
  <path d="m131-143c-3 3-6 7-6 11s2 9 6 11c-4 16 3 14 3 17-3 9 3 15 5 17-5 10 4 16 4 16-3 8 2 15 5 16-2 5 2 15 3 16-2 5 3 16 3 16-1 2-5 11 2 17-4 8 0 15 2 16 0 0-8 10 0 17-5 10 0 15 1 16-4 5-3 13 1 17-8 8 0 17 1 17-7 8-2 17-1 18-5 6 0 17 0 17-4 6-4 12 1 17-5 13 2 13 2 19-6 9 2 15 5 18-6 13 23 21 23 11 5 1 17-1 18-14 0 0 0-1-1-1 7-3 10-10 9-17 4-4 7-12 5-18 4-3 5-14 5-14 2-3 6-14 2-19 5-5 6-13 1-18 5-7 3-15 1-17 4-6 4-13 0-17 4-6 2-12-1-17 4-7 3-13-2-18 1-2 4-11-2-17 3-11-6-16-4-17 1-2 3-12-5-16 6-10-4-17-4-17 3-8-2-12-6-17 2-6-6-15-7-16 2-8-2-13-9-16 1-11-6-14-9-14-3-11-10-15-10-15-2-9-7-13-16-14-8-12-29 0-25 9z" fill="#fd9"/>
  <path transform="translate(148,-122) rotate(-30)" d="m-14-10c7 2 9 5 8 8s-4 4-11 2-14-7-14-10c1-3 10-2 17 0zm30 10c-6 2-9 1-10-2-1-2 1-5 8-8 7-2 16-3 17-0s-7 7-14 10zm-11 16c-4-6-4-10-1-11 2-2 5-1 9 5 5 6 8 14 6 16s-9-4-14-10zm-18-6c4-6 8-7 10-5s2 5-2 11-11 12-13 10 1-10 5-16zm18-26c0 7-2 10-5 10s-5-3-5-10 2-16 5-16 5 9 5 16zm0 16a5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5 5 5 0 0 1 5 5z" fill="#e2e2ff"/>
</g>
<path d="m151 24 76-44 2 9-74 46z" fill="#4d3559" stroke="${strokecolor}" stroke-linejoin="round" stroke-width="3"/>
<path d="m236 7-86-39-1 9 87 39z" fill="#4d3559" stroke="${strokecolor}" stroke-linejoin="round" stroke-width="3"/>
<use transform="scale(-1,1)" href="#ebifryA"/>`);
  }
  if (parts3.includes("arayasearch")) {
    svgChildren.push(`<g id="searchA" stroke-linejoin="round" stroke-width="3">
  <path d="m45-119c21-21 40-29 78-36 2 0 6 1 6 2 4 21-2 61-8 88" fill="#9e3438" stroke="#42364a"/>
  <path d="m50-124c-8-1-13 4-16 8 43 11 65 36 86 66 1-4 3-11 1-16-20-31-45-49-71-58z" fill="#f2b179" stroke="#42364a"/>
  <path d="m124-79-3 14-8-12-20-37 26-40h8l4 7-23 34z" fill="#42364a"/>
</g>
<use transform="scale(-1,1)" href="#searchA"/>
<g stroke-linecap="round" stroke-linejoin="round" stroke-width="3">
  <path d="m-117-139c4-1 11 8 11 8s11-2 13 3c2 3-2 11-2 11s4 15-1 19c-3 3-13-1-13-1s-9 8-13 6-4-14-4-14-9-6-9-10 9-9 9-9 2-12 9-13z" fill="#732f2e" stroke="#42364a"/>
  <path d="m-116-123c0 12 4 5 10 11m-14-2c8-4 7 1 10-9" fill="none" stroke="#f2b179"/>
  <path d="m122-117c-2 0-4 2-4 8 15 5 28 21 7 29l-2 8s9-1 13-4c13-10 8-36-14-41z" fill="#f2b179" stroke="#42364a"/>
</g>
`);
  }
  return [
    `<svg viewBox="${viewboxString}" xmlns="http://www.w3.org/2000/svg" style="${svgStyle}">`,
    ...style ? [`<style>`, style, `</style>`] : [],
    `<defs>`,
    ...defsChildren,
    `</defs>`,
    ...svgChildren,
    `</svg>`
  ].join("\n");
};
var orbio = { name, parts, color, draw };

// src/puge.ts
var name2 = "puge";
var parts2 = [
  ["hearta", "sumi"],
  ["drilla", "drillb"],
  ["ashia", "ashib"],
  ["mask", "charmy"]
].flat();
var color2 = {
  bodycolor: "#e6a1a1",
  strokecolor: "#323232",
  hugecolor: "#ff80aa"
};
var draw2 = ({ parts: parts3 = [], color: color3, viewbox, style }) => {
  const svgStyle = color3 ? getStyleString(color3) : "";
  const viewboxString = viewbox ? getViewboxString(viewbox) : "-256 -256 512 512";
  const bodycolor = "var(--bodycolor, #ccc)", strokecolor = "var(--strokecolor, #323232)", hugecolor = "var(--hugecolor, #80ffa6)", blackcolor = "var(--blackcolor, #323232)", greycolor = "var(--greycolor, #6e6e6e)";
  const svgChildren = [];
  const defsChildren = [];
  defsChildren.push(`<radialGradient id="eyeG">
  <stop stop-color="#fff" offset=".5"/>
  <stop stop-color="#000" offset="1"/>
</radialGradient>
<mask id="eyeM">
  <circle r="10" fill="url(#eyeG)"/>  
</mask>
<path id="bodyP" d="m -136,0 c 0,75 61,136 136,136 75,0 136,-61 136,-136 0,-20 -4,-39 -12,-56 l -4,-48 c -1,-11 3,-21 4,-32 l -24,12 c -4,-9 -5,-21 -4,-36 l -24,16 c -10,-10 -16,-22 -20,-36 l -24,16 c -10,-11 -20,-22 -28,-44 -7,17 -16,32 -28,44 l -24,-16 c -4,15 -11,27 -20,36 l -24,-16 c 1,15 0,27 -4,36 l -24,-12 c 2,11 6,21 4,32 l -4,48 c -8,17 -12,36 -12,56 z"/>
<path id="bodyQ" d="m -148,32 v -68 h 20 l 16,12 16,-32 16,24 8,-16 16,16 16,-16 16,16 24,-32 24,32 16,-16 16,16 16,-16 8,16 16,-24 16,32 16,-12 h 20 V 32 H 132 L 120,28 96,48 72,28 48,48 24,27 0,58 -24,27 -48,48 -72,28 l -24,20 -24,-20 -12,4 z"/>
<clipPath id="bodyClip" >
  <circle r="136"/>
</clipPath>`);
  svgChildren.push(`<g stroke="${strokecolor}" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
  <use href="#bodyP" stroke="none" fill="${bodycolor}"/>
  <g clip-path="url(#bodyClip)">
    <use href="#bodyQ" stroke-width="12"/>
    <use href="#bodyQ" fill="${blackcolor}" stroke="${greycolor}"/>
  </g>
  <path d="m -100,-124 16,16 m 12,-36 16,20 m 28,-40 8,32 m 120,8 -16,16 m -12,-36 -16,20 m -28,-40 -8,32"/>
  <use href="#bodyP" fill="none"/>
</g>
<g fill="${hugecolor}">
  <circle id="eyeA" transform="translate(0 -20)" r="10" mask="url(#eyeM)"/>
  <use id="eyeB" transform="rotate(240)" href="#eyeA"/>
  <use id="eyeC" transform="rotate(120)" href="#eyeA"/>
</g>`);
  svgChildren.push(`<g fill="${strokecolor}" stroke="${strokecolor}" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
  <path id="gtltP" d="m 17,-81 54,-25 2,9 -33,15 30,8 v 8 z"/>
  <use href="#gtltP" transform="scale(-1,1)"/>
</g>`);
  if (parts3.includes("sumi")) {
    svgChildren.push(`<g stroke="${strokecolor}" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
  <path d="m -40,-76 40,-8 40,8" fill="none"/>
  <path d="m -122,60 h 74 l 16,28 H 0 32 L 48,60 h 74" fill="none"/>
</g>`);
  }
  if (parts3.some((s) => s.startsWith("ashi"))) {
    defsChildren.push(`<g id="ashiP" fill="${bodycolor}" stroke="${strokecolor}" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
  <ellipse rx="28" ry="32" fill="${greycolor}"/>
  <path d="M 66,-4 30,4 11,-24 58,-64 Z"/>
  <path d="M 58,197 C 43,203 29,183 31,167 l 3,-13 c 1,-5 14,-6 24,-10 6,-2 -24,10 -22,-3 l 2,-13 c 3,-12 45,-15 54,-7 15,16 24,38 11,50 -14,17 -25,20 -44,26 z"/>
  <path d="m 0,-235 c -19,7 -26,20 -26,39 0,19 19.01,32 39,32 19,0 32,-13 32,-38 -26,6 -19,-20 -19,-20 0,0 -13,13 -26,-13 z"/>
  <path d="m 0,-235 c -13,34 4,52 32,65" fill="none"/>
  <path d="m 18,-162 c 4,-8 11,-11 20,-8 20,19 52,68 32,104 l -40,12 c 24,-36 8,-68 -12,-108 z"/>
  <path d="M 27.9,-33.7 C 25.5,-66.1 31,-84.1 38.8,-86.2 46.5,-88.3 64.9,-73.5 82,-48 110,-5.81 111,108 94.3,123 80.9,134 71,128 52.9,119 69.8,22.5 30.5,7.1 27.9,-33.7 Z"/>
  <path d="m 6,-28 11,-1 c 2,14 6,23 17,33 l -8,8 C 15,3 8,-15 6,-28 Z"/>
</g>`);
    if (parts3.includes("ashia")) {
      svgChildren.push(`<use href="#ashiP" transform="translate(134)"/>`);
    }
    if (parts3.includes("ashib")) {
      svgChildren.push(
        `<use href="#ashiP" transform="translate(-134) scale(-1,1)"/>`
      );
    }
  }
  if (parts3.includes("hearta")) {
    svgChildren.push(`<g transform="translate(76,80)" fill="${hugecolor}" stroke="${strokecolor}" stroke-linejoin="round" stroke-width="5" paint-order="stroke">
  <path d="m-13 2c-4-4-5-10-3-14 1-3 5-4 8-3s8 6 8 6 5-6 8-6c3-1 6 1 8 3 2 4 1 10-3 14-3 3-13 9-13 9s-10-6-13-9z"/>
</g>`);
  }
  if (parts3.some((s) => s.startsWith("drill"))) {
    defsChildren.push(`<g id="drill" fill="${greycolor}" stroke="${strokecolor}" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
  <path d="m28-2-27-63-1-2-1 2-28 63c13 10 45 10 57 0z"/>
  <path d="m-11-42c7-1 14-4 17-8m-26 29c12 0 28-6 33-14m-36 36c19-3 36-8 43-19" fill="none"/>
</g>`);
    if (parts3.includes("drilla")) {
      svgChildren.push(
        `<use transform="translate(98,-94) rotate(36)" href="#drill"/>`
      );
    }
    if (parts3.includes("drillb")) {
      svgChildren.push(
        `<use transform="translate(-98,-94) rotate(-36)" href="#drill"/>`
      );
    }
  }
  if (parts3.includes("charmy")) {
    defsChildren.push(`<path id="charmyP" d="m-12 32c-18 0-32-14-32-32s14-32 32-32v20c-8 0-12 8-12 12s4 12 12 12h24c8 0 12-8 12-12s-4-12-12-12v-20c18 0 32 14 32 32s-14 32-32 32h-24"/>`);
    svgChildren.push(`<g stroke="${strokecolor}" stroke-linejoin="round" stroke-width="4">
  <use href="#charmyP" transform="translate(96,-138) rotate(20)" fill="#24459b"/>
  <use href="#charmyP" transform="translate(-96,-138) rotate(-20)" fill="#24459b"/>
  <path d="m-136 0c0 63 44 120 112 120v16c-80 0-128-61-128-136s48-136 128-136h48c80 0 128 61 128 136s-48 136-128 136v-16c68 0 112-57 112-120s-44-120-112-120h-48c-68 0-112 57-112 120z" fill="#5ac3dc"/>
</g>`);
  }
  if (parts3.includes("mask")) {
    svgChildren.push(`<g  fill="${greycolor}" stroke="${strokecolor}" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
  <g id="maskP">
    <path d="m 0,-46 c 26,-7 63,-4 84,-22 l 16,4 -4,-16 c 13,-22 20,-36 20,-80 -20,60 -68,52 -116,64 z"/>
    <path d="m 0,-76 c 0,0 28,13 44,13 16,0 28,-29 28,-29 -11,6 -72,16 -72,16 z" fill="${blackcolor}" stroke-width="2"/>
    <path d="m 84,-68 v -12 h 12 m 20,-80 c -8,60 -28,60 -44,68 l 12,12" fill="none" stroke-width="2"/>
  </g>
  <use transform="scale(-1,1)" href="#maskP"/>
  <path d="M 0,-192 -36,-117 0,-44 36,-117 0,-192"/>
  <path d="M 0,-168 16,-120 0,-71 -16,-120 Z" stroke-width="2" fill="${blackcolor}"/>
  <g fill="${hugecolor}" stroke="none">
    <circle id="maskEye" transform="translate(36,-76) scale(.75)" r="10" mask="url(#eyeM)"/>
    <use href="#maskEye" transform="scale(-1,1)"/>
    <circle transform="translate(0,-120) scale(.75,2)" r="10" mask="url(#eyeM)"/>
  </g>
</g>
`);
  }
  return [
    `<svg viewBox="${viewboxString}" xmlns="http://www.w3.org/2000/svg" style="${svgStyle}">`,
    ...style ? [`<style>`, style, `</style>`] : [],
    `<defs>`,
    ...defsChildren,
    `</defs>`,
    ...svgChildren,
    `</svg>`
  ].join("\n");
};
var puge = { name: name2, parts: parts2, color: color2, draw: draw2 };

// src/colorpicker.ts
var inputType = "inputfrompicker";
var target;
var state = { h: 138, s: 0.5, v: 1 };
var setPicker = ($input) => {
  if ($input)
    target = $input;
  setHSV(toHSV(target.value));
  target?.insertAdjacentElement("afterend", $colorpicker);
};
var setHSV = ({ h, s, v }, needsRGB = false) => {
  if (h != void 0 && h != state.h) {
    state.h = h;
    $colorH.valueAsNumber = h;
    $colorpicker.style.setProperty("--picked-hue", h.toString());
    needsRGB = needsRGB || !!(s ?? state.s);
  }
  if (s != void 0 && s != state.s) {
    state.s = s;
    $colorSV.style.setProperty("left", `${100 * s}%`);
    needsRGB = true;
  }
  if (v != void 0 && v != state.v) {
    state.v = v;
    $colorSV.style.setProperty("top", `${100 - 100 * v}%`);
    needsRGB = true;
  }
  if (target && needsRGB) {
    target.value = toRGB(state);
    target.dispatchEvent(
      new InputEvent("input", { bubbles: true, cancelable: true, inputType })
    );
  }
};
var handlePointerMove = (e) => {
  if (e.target == e.currentTarget && e.buttons == 1) {
    $colorpallet.setPointerCapture(e.pointerId);
    const { width, height } = $colorpallet.getBoundingClientRect();
    const v = clamp(1 - e.offsetY / height, 0, 1);
    const s = clamp(e.offsetX / width, 0, 1);
    setHSV({ s, v });
  }
};
var initColorPicker = (inputs, { initTarget = inputs.at(-1) } = {}) => {
  $colorH.oninput = () => {
    setHSV({ h: $colorH.valueAsNumber });
  };
  $colorpallet.onpointermove = handlePointerMove;
  $colorpallet.onpointerdown = handlePointerMove;
  inputs.forEach(($input) => {
    $input.addEventListener("click", (e) => {
      if ($input == target || $input.disabled || !$input.name)
        return;
      e.preventDefault();
      setPicker($input);
    });
    $input.addEventListener("input", (e) => {
      if (inputType != e.inputType && $input == target) {
        setHSV(toHSV(target.value));
      }
    });
  });
  setPicker(initTarget);
};

// src/main.ts
var huges = [orbio, puge];
var huge = huges[0];
var setSVG = () => {
  $preview.innerText = "";
  const options = {
    parts: [...new FormData($parts).keys()],
    color: new FormData($color),
    viewbox: new FormData($viewbox)
  };
  $preview.insertAdjacentHTML(
    "beforeend",
    huge.draw(options)
  );
};
var isInput = (e) => "INPUT" === e?.tagName.toUpperCase() && !!e.name;
var $partsInputs = [...$parts.elements].filter(isInput);
var setHuge = () => {
  huge = huges.find((h) => h.name == $huge.base.value) ?? huges[0];
  $partsInputs.forEach(($el) => $el.disabled = !huge.parts.includes($el.name));
};
$huge.onchange = () => {
  setHuge();
  setSVG();
};
$parts.onchange = setSVG;
var setColor = throttle(() => {
  const $svg = $preview.querySelector("svg");
  if ($svg)
    $svg.style.cssText = getStyleString(new FormData($color));
});
$color.oninput = setColor;
var $colorInputs = [...$color.elements].filter(isInput).filter(
  (el) => el.type === "color"
);
$color.onreset = (e) => {
  e.preventDefault();
  const hugeDefaultColor = getColor(huge.color);
  $colorInputs.forEach(($i) => $i.value = hugeDefaultColor[$i.name]);
  setColor();
  setPicker();
};
$random.onclick = () => {
  const hugeHue = Math.random() * 360;
  const diff = +($randommode.value ?? "120");
  $color.hugecolor.value = toRGB({ h: hugeHue, s: 0.5, v: 1 });
  const hues = [hugeHue + diff, hugeHue - diff].toSorted(() => Math.random() - 0.5);
  $color.bgcolor.value = toRGB({ h: hues[0], s: 0.2, v: 1 });
  $color.bodycolor.value = toRGB({ h: hues[1], s: 0.3, v: 0.8 });
  const strokeHue = (hugeHue + hues[1]) / 2;
  $color.strokecolor.value = toRGB({ h: strokeHue, s: 0.4, v: 0.3 });
  setColor();
  setPicker();
};
var setViewbox = throttle(() => {
  $viewbox.querySelectorAll(`label:has([type="range"])`).forEach(($label) => {
    const $span = $label.querySelector("span");
    if ($span) {
      $span.innerText = ("+" + $label.querySelector("input")?.value + "%").replace("+-", "-");
    }
  });
  const $svg = $preview.querySelector("svg");
  if ($svg) {
    $svg.setAttributeNS(
      null,
      "viewBox",
      getViewboxString(new FormData($viewbox))
    );
  }
});
$viewbox.oninput = setViewbox;
var timestamp = () => (/* @__PURE__ */ new Date()).toLocaleString("sv").replace(" ", "_").replaceAll(/[^\d_]/g, "");
var download = (url, filebase, format) => {
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filebase}_${timestamp()}.${format}`;
  a.click();
  URL.revokeObjectURL(url);
};
$output.onsubmit = () => {
  const filebase = "orbio";
  const format = $output.format.value;
  const $svg = $preview.querySelector("svg");
  if (!$svg)
    throw new Error("svg not found");
  const svgText = new XMLSerializer().serializeToString($svg);
  const svgBlob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
  const svgUrl = URL.createObjectURL(svgBlob);
  if (["png", "jpg", "webp"].includes(format)) {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(svgUrl);
      const size = 512;
      const canvas = new OffscreenCanvas(size, size);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, size, size);
      canvas.convertToBlob({
        type: `image/${format === "jpg" ? "jpeg" : format}`
      }).then((blob) => {
        const imgUrl = URL.createObjectURL(blob);
        download(imgUrl, filebase, format);
      });
    };
    img.src = svgUrl;
  } else {
    download(svgUrl, filebase, format);
  }
  return false;
};
setHuge();
setViewbox();
setSVG();
initColorPicker($colorInputs);
