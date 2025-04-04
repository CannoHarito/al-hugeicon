import { DrawOptions, getStyleString, getViewboxString } from "./util.ts";

export function puge(
  { parts = [], color, viewbox, style }: Partial<DrawOptions>,
) {
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
<path id="bodyP" d="m -136,0 c 0,75 61,136 136,136 75,0 136,-61 136,-136 0,-20 -4,-39 -12,-56 l -4,-48 c -1,-11 3,-21 4,-32 l -24,12 c -4,-9 -5,-21 -4,-36 l -24,16 c -10,-10 -16,-22 -20,-36 l -24,16 c -10,-11 -20,-22 -28,-44 -7,17 -16,32 -28,44 l -24,-16 c -4,15 -11,27 -20,36 l -24,-16 c 1,15 0,27 -4,36 l -24,-12 c 2,11 6,21 4,32 l -4,48 c -8,17 -12,36 -12,56 z"/>
<path id="bodyQ" d="m -148,32 v -68 h 20 l 16,12 16,-32 16,24 8,-16 16,16 16,-16 16,16 24,-32 24,32 16,-16 16,16 16,-16 8,16 16,-24 16,32 16,-12 h 20 V 32 H 132 L 120,28 96,48 72,28 48,48 24,27 0,58 -24,27 -48,48 -72,28 l -24,20 -24,-20 -12,4 z"/>
<clipPath id="bodyClip" >
  <circle r="136"/>
</clipPath>`);
  svgChildren.push(`\
<g stroke="${strokecolor}" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
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

  // paint gtlt ><
  svgChildren.push(`\
<g fill="${strokecolor}" stroke="${strokecolor}" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
  <path id="gtltP" d="m 17,-81 54,-25 2,9 -33,15 30,8 v 8 z"/>
  <use href="#gtltP" transform="scale(-1,1)"/>
</g>`);

  // paint sumi
  if (parts.includes("sumi")) {
    svgChildren.push(`\
<g stroke="${strokecolor}" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
  <path d="m -40,-76 40,-8 40,8" fill="none"/>
  <path d="m -122,60 h 74 l 16,28 H 0 32 L 48,60 h 74" fill="none"/>
</g>`);
  }
  // paint ashi
  if (parts.some((s) => s.startsWith("ashi"))) {
    defsChildren.push(`\
<g id="ashiP" fill="${bodycolor}" stroke="${strokecolor}" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
  <ellipse rx="28" ry="32" fill="${greycolor}"/>
  <path d="M 66,-4 30,4 11,-24 58,-64 Z"/>
  <path d="M 58,197 C 43,203 29,183 31,167 l 3,-13 c 1,-5 14,-6 24,-10 6,-2 -24,10 -22,-3 l 2,-13 c 3,-12 45,-15 54,-7 15,16 24,38 11,50 -14,17 -25,20 -44,26 z"/>
  <path d="m 0,-235 c -19,7 -26,20 -26,39 0,19 19.01,32 39,32 19,0 32,-13 32,-38 -26,6 -19,-20 -19,-20 0,0 -13,13 -26,-13 z"/>
  <path d="m 0,-235 c -13,34 4,52 32,65" fill="none"/>
  <path d="m 18,-162 c 4,-8 11,-11 20,-8 20,19 52,68 32,104 l -40,12 c 24,-36 8,-68 -12,-108 z"/>
  <path d="M 27.9,-33.7 C 25.5,-66.1 31,-84.1 38.8,-86.2 46.5,-88.3 64.9,-73.5 82,-48 110,-5.81 111,108 94.3,123 80.9,134 71,128 52.9,119 69.8,22.5 30.5,7.1 27.9,-33.7 Z"/>
  <path d="m 6,-28 11,-1 c 2,14 6,23 17,33 l -8,8 C 15,3 8,-15 6,-28 Z"/>
</g>`);
    if (parts.includes("ashia")) {
      svgChildren.push(`<use href="#ashiP" transform="translate(134)"/>`);
    }
    if (parts.includes("ashib")) {
      svgChildren.push(
        `<use href="#ashiP" transform="translate(-134) scale(-1,1)"/>`,
      );
    }
  }

  // paint heartA
  if (parts.includes("hearta")) {
    svgChildren.push(`\
<g transform="translate(76,80)" fill="${hugecolor}" stroke="${strokecolor}" stroke-linejoin="round" stroke-width="5" paint-order="stroke">
  <path d="m-13 2c-4-4-5-10-3-14 1-3 5-4 8-3s8 6 8 6 5-6 8-6c3-1 6 1 8 3 2 4 1 10-3 14-3 3-13 9-13 9s-10-6-13-9z"/>
</g>`);
  }
  // paint drill
  if (parts.some((s) => s.startsWith("drill"))) {
    defsChildren.push(`\
<g id="drill" fill="${greycolor}" stroke="${strokecolor}" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
  <path d="m28-2-27-63-1-2-1 2-28 63c13 10 45 10 57 0z"/>
  <path d="m-11-42c7-1 14-4 17-8m-26 29c12 0 28-6 33-14m-36 36c19-3 36-8 43-19" fill="none"/>
</g>`);
    if (parts.includes("drilla")) {
      svgChildren.push(
        `<use transform="translate(98,-94) rotate(36)" href="#drill"/>`,
      );
    }
    if (parts.includes("drillb")) {
      svgChildren.push(
        `<use transform="translate(-98,-94) rotate(-36)" href="#drill"/>`,
      );
    }
  }

  // paint charmy
  if (parts.includes("charmy")) {
    defsChildren.push(`\
<path id="charmyP" d="m-12 32c-18 0-32-14-32-32s14-32 32-32v20c-8 0-12 8-12 12s4 12 12 12h24c8 0 12-8 12-12s-4-12-12-12v-20c18 0 32 14 32 32s-14 32-32 32h-24"/>`);
    svgChildren.push(`\
<g stroke="${strokecolor}" stroke-linejoin="round" stroke-width="4">
  <use href="#charmyP" transform="translate(96,-138) rotate(20)" fill="#24459b"/>
  <use href="#charmyP" transform="translate(-96,-138) rotate(-20)" fill="#24459b"/>
  <path d="m-136 0c0 63 44 120 112 120v16c-80 0-128-61-128-136s48-136 128-136h48c80 0 128 61 128 136s-48 136-128 136v-16c68 0 112-57 112-120s-44-120-112-120h-48c-68 0-112 57-112 120z" fill="#5ac3dc"/>
</g>`);
  }
  // paint mask
  if (parts.includes("mask")) {
    svgChildren.push(`\
<g  fill="${greycolor}" stroke="${strokecolor}" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
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
    ...(style ? [`<style>`, style, `</style>`] : []),
    `<defs>`,
    ...defsChildren,
    `</defs>`,
    ...svgChildren,
    `</svg>`,
  ].join("\n");
}
