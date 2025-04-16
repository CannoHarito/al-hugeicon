import { getStyleString, getViewboxString, Huge } from "./util.ts";

const name = "orbio";
const parts = [
  ["hoshia", "hoshib", "hearta", "sumi"],
  ["tunoa", "tunob", "tunoc", "tunod", "drilla", "drillb"],
  ["ashia", "ashib"],
  ["yunicap", "dainsleif", "twinebifry"],
].flat();
const color = {
  bodycolor: "#cccccc",
  strokecolor: "#323232",
  hugecolor: "#80ffa6",
};
const draw: Huge["draw"] = ({
  parts = ["hoshia", "tunoa", "tunob", "tunoc", "tunod", "ashia", "ashib"],
  color,
  viewbox,
  style,
} = {}) => {
  const svgStyle = color ? getStyleString(color) : "";
  const viewboxString = viewbox
    ? getViewboxString(viewbox)
    : "-256 -256 512 512";
  const bodycolor = "var(--bodycolor, #ccc)",
    strokecolor = "var(--strokecolor, #323232)",
    hugecolor = "var(--hugecolor, #80ffa6)",
    blackcolor = "var(--blackcolor, #323232)",
    greycolor = "var(--greycolor, #6e6e6e)";

  const svgChildren: string[] = [];
  const defsChildren: string[] = [];

  defsChildren.push(`\
<radialGradient id="eyeG">
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
  svgChildren.push(`\
<g stroke="${strokecolor}" stroke-linejoin="round" stroke-width="4">
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

  if (parts.includes("sumi")) {
    svgChildren.push(`\
<g fill="none" stroke="${strokecolor}" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
  <path id="sumiP" d="m-126 45h2c7-3 10-7 16-15 3-4 42-4 46 0 8 8 18 26 26 34 4 4 68 4 72 0 8-8 18-26 26-34 4-4 43-4 46 0 6 8 9 12 16 15h2"/>
  <use transform="scale(1,-1)" href="#sumiP"/>
  <circle id="sumiC" cx="-60" cy="60" r="6"/>
  <use transform="scale(-1)" href="#sumiC"/>
</g>`);
  }

  const ashiA = `\
<g id="ashiA" transform="translate(126)" fill="${bodycolor}" stroke="${strokecolor}" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
  <ellipse rx="12" ry="38" fill="${greycolor}"/>
  <path d="m2-19 41-12v59l-41-9c-3-12-3-25 0-38z"/>
  <path d="m53-172c-8-16-18-21-28-24-4 20-11 37-20 52 12 12 28 116 32 144s4 132 4 132c22 17 26 30 32 44 16-14 21-29 24-44 0-20 4-85-8-156-11-66-24-128-36-148z"/>
  <path d="m37-16c23 3 51 13 52-8m8 156c-4 12-8 20-56 0m12-304c-8-5-10-19-48 28m20-52c41 45 64 192 64 280 0 32 4 64-16 92" fill="none"/>
</g>`;
  const ashiB = `<use transform="scale(-1,1)" href="#ashiA"/>`;
  if (parts.includes("ashia")) svgChildren.push(ashiA);
  else if (parts.includes("ashib")) defsChildren.push(ashiA);
  if (parts.includes("ashib")) svgChildren.push(ashiB);

  if (parts.some((s) => s.startsWith("hoshi"))) {
    defsChildren.push(`\
<g id="hoshi">
  <path d="m0-25 10.3 10.8 13.5 6.5-7.2 13.1-1.9 14.8-14.7-2.7-14.7 2.7-1.9-14.8-7.1-13.1 13.5-6.4z" stroke="${strokecolor}" stroke-linejoin="round" stroke-width="4"/>
  <path id="hoshiP" d="m-4 17h8l-4-13z" fill="${strokecolor}"/>
  <use transform="rotate(-72)" href="#hoshiP"/>
  <use transform="rotate(216)" href="#hoshiP"/>
  <use transform="rotate(144)" href="#hoshiP"/>
  <use transform="rotate(72)" href="#hoshiP"/>
</g>`);
    if (parts.includes("hoshia")) {
      svgChildren.push(
        `<use transform="translate(80 56) rotate(15)" fill="${hugecolor}" href="#hoshi"/>`,
      );
    }
    if (parts.includes("hoshib")) {
      svgChildren.push(
        `<use transform="translate(-80 -48) rotate(30)" fill="${hugecolor}" href="#hoshi"/>`,
      );
    }
  }

  if (parts.includes("hearta")) {
    svgChildren.push(`\
<g transform="translate(84 56)" fill="${hugecolor}" stroke="${strokecolor}" stroke-linejoin="round" stroke-width="5" paint-order="stroke">
  <path d="m-13 2c-4-4-5-10-3-14 1-3 5-4 8-3s8 6 8 6 5-6 8-6c3-1 6 1 8 3 2 4 1 10-3 14-3 3-13 9-13 9s-10-6-13-9z"/>
</g>`);
  }

  if (parts.some((s) => s.startsWith("tuno"))) {
    defsChildren.push(`\
<g id="tuno" stroke-linejoin="round" stroke-width="4">
  <path d="m-38 0c6 2 22 4 22 4l12 8c2.67 1.33 5.33 1.33 8 0l12-8s16-2 22-4c3.16-1.05-6-8-6-8-16-20-24-36-28-56 0 0-1-2-4-2s-4 2-4 2c-4 20-12 36-28 56 0 0-9.16 6.95-6 8z" fill="${hugecolor}" stroke="${strokecolor}"/>
  <path id="tunoP" d="m-13 4c4.98-12.8 6.88-28.5 9-44-4 15-9 29-15 43" fill="${strokecolor}" stroke="${strokecolor}" stroke-width="2"/>
  <use transform="scale(-1,1)" href="#tunoP"/>
</g>`);
    if (parts.includes("tunoa")) {
      svgChildren.push(
        `<use transform="translate(76,-96) rotate(32)" href="#tuno"/>`,
      );
    }
    if (parts.includes("tunob")) {
      svgChildren.push(
        `<use transform="translate(-76,-96) rotate(-32)" href="#tuno"/>`,
      );
    }
    if (parts.includes("tunoc")) {
      svgChildren.push(
        `<use transform="translate(76,100) rotate(148)" href="#tuno"/>`,
      );
    }
    if (parts.includes("tunod")) {
      svgChildren.push(
        `<use transform="translate(-76,100) rotate(212)" href="#tuno"/>`,
      );
    }
  }

  if (parts.some((s) => s.startsWith("drill"))) {
    defsChildren.push(`\
<g id="drill" fill="${greycolor}" stroke="${strokecolor}" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
  <path d="m28-2-27-63-1-2-1 2-28 63c13 10 45 10 57 0z"/>
  <path d="m-11-42c7-1 14-4 17-8m-26 29c12 0 28-6 33-14m-36 36c19-3 36-8 43-19" fill="none"/>
</g>`);
  }
  if (parts.includes("drilla")) {
    svgChildren.push(
      `<use transform="translate(76,-96) rotate(28)" href="#drill"/>`,
    );
  }
  if (parts.includes("drillb")) {
    svgChildren.push(
      `<use transform="translate(-76,-96) rotate(-28)" href="#drill"/>`,
    );
  }
  if (parts.includes("yunicap")) {
    svgChildren.push(`\
<g fill-rule="evenodd" stroke="#13258a" stroke-linejoin="round">
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
  if (parts.includes("dainsleif")) {
    svgChildren.push(`\
<g stroke="${strokecolor}" stroke-linejoin="round" stroke-linecap="round" stroke-width="2" transform="translate(76,-124) rotate(32)">
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
  if (parts.includes("twinebifry")) {
    svgChildren.push(`\
<g id="ebifryA" stroke-linejoin="round" stroke-width="3" stroke="${strokecolor}">
  <path d="m143-150s10-53-1-68c-4-5-10-5-14-1-6 6-6 33-6 33s-17-15-22-8c-3 2-5 11-3 17 7 22 41 34 41 34z" fill="#ff9f3f"/>
  <path d="m120-191c11 10 19 25 23 41l-5 7c-7-15-16-33-18-48z" fill="#ff9f3f"/>
  <path d="m131-143c-3 3-6 7-6 11s2 9 6 11c-4 16 3 14 3 17-3 9 3 15 5 17-5 10 4 16 4 16-3 8 2 15 5 16-2 5 2 15 3 16-2 5 3 16 3 16-1 2-5 11 2 17-4 8 0 15 2 16 0 0-8 10 0 17-5 10 0 15 1 16-4 5-3 13 1 17-8 8 0 17 1 17-7 8-2 17-1 18-5 6 0 17 0 17-4 6-4 12 1 17-5 13 2 13 2 19-6 9 2 15 5 18-6 13 23 21 23 11 5 1 17-1 18-14 0 0 0-1-1-1 7-3 10-10 9-17 4-4 7-12 5-18 4-3 5-14 5-14 2-3 6-14 2-19 5-5 6-13 1-18 5-7 3-15 1-17 4-6 4-13 0-17 4-6 2-12-1-17 4-7 3-13-2-18 1-2 4-11-2-17 3-11-6-16-4-17 1-2 3-12-5-16 6-10-4-17-4-17 3-8-2-12-6-17 2-6-6-15-7-16 2-8-2-13-9-16 1-11-6-14-9-14-3-11-10-15-10-15-2-9-7-13-16-14-8-12-29 0-25 9z" fill="#fd9"/>
  <path transform="translate(148,-122) rotate(-30)" d="m-14-10c7 2 9 5 8 8s-4 4-11 2-14-7-14-10c1-3 10-2 17 0zm30 10c-6 2-9 1-10-2-1-2 1-5 8-8 7-2 16-3 17-0s-7 7-14 10zm-11 16c-4-6-4-10-1-11 2-2 5-1 9 5 5 6 8 14 6 16s-9-4-14-10zm-18-6c4-6 8-7 10-5s2 5-2 11-11 12-13 10 1-10 5-16zm18-26c0 7-2 10-5 10s-5-3-5-10 2-16 5-16 5 9 5 16zm0 16a5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5 5 5 0 0 1 5 5z" fill="#e2e2ff"/>
</g>
<path d="m151 24 76-44 2 9-74 46z" fill="#4d3559" stroke="${strokecolor}" stroke-linejoin="round" stroke-width="3"/>
<path d="m236 7-86-39-1 9 87 39z" fill="#4d3559" stroke="${strokecolor}" stroke-linejoin="round" stroke-width="3"/>
<use transform="scale(-1,1)" href="#ebifryA"/>`);
  }
  return [
    `<svg viewBox="${viewboxString}" xmlns="http://www.w3.org/2000/svg" style="${svgStyle}">`,
    ...(style ? [`<style>`, style, `</style>`] : []),
    `<defs>`,
    ...defsChildren,
    `</defs>`,
    ...svgChildren,
    `</svg>`,
  ].join("\n");
};

export const orbio: Huge = { name, parts, color, draw };
