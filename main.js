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
var colorNames = [
  "bgcolor",
  "bodycolor",
  "strokecolor",
  "hugecolor",
  "blackcolor",
  "greycolor"
];
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

// src/orbio.ts
function orbio({
  parts = ["hoshia", "tunoa", "tunob", "tunoc", "tunod", "ashia", "ashib"],
  color,
  viewbox,
  style
} = {}) {
  const svgStyle = color ? getStyleString(color) : "";
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
  if (parts.includes("sumi")) {
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
  if (parts.includes("ashia"))
    svgChildren.push(ashiA);
  else if (parts.includes("ashib"))
    defsChildren.push(ashiA);
  if (parts.includes("ashib"))
    svgChildren.push(ashiB);
  if (parts.some((s) => s.startsWith("hoshi"))) {
    defsChildren.push(`<g id="hoshi">
  <path d="m0-25 10.3 10.8 13.5 6.5-7.2 13.1-1.9 14.8-14.7-2.7-14.7 2.7-1.9-14.8-7.1-13.1 13.5-6.4z" stroke="${strokecolor}" stroke-linejoin="round" stroke-width="4"/>
  <path id="hoshiP" d="m-4 17h8l-4-13z" fill="${strokecolor}"/>
  <use transform="rotate(-72)" href="#hoshiP"/>
  <use transform="rotate(216)" href="#hoshiP"/>
  <use transform="rotate(144)" href="#hoshiP"/>
  <use transform="rotate(72)" href="#hoshiP"/>
</g>`);
    if (parts.includes("hoshia")) {
      svgChildren.push(
        `<use transform="translate(80 56) rotate(15)" fill="${hugecolor}" href="#hoshi"/>`
      );
    }
    if (parts.includes("hoshib")) {
      svgChildren.push(
        `<use transform="translate(-80 -48) rotate(30)" fill="${hugecolor}" href="#hoshi"/>`
      );
    }
  }
  if (parts.includes("hearta")) {
    svgChildren.push(`<g transform="translate(84 56)" fill="${hugecolor}" stroke="${strokecolor}" stroke-linejoin="round" stroke-width="5" paint-order="stroke">
  <path d="m-13 2c-4-4-5-10-3-14 1-3 5-4 8-3s8 6 8 6 5-6 8-6c3-1 6 1 8 3 2 4 1 10-3 14-3 3-13 9-13 9s-10-6-13-9z"/>
</g>`);
  }
  if (parts.some((s) => s.startsWith("tuno"))) {
    defsChildren.push(`<g id="tuno" stroke-linejoin="round" stroke-width="4">
  <path d="m-38 0c6 2 22 4 22 4l12 8c2.67 1.33 5.33 1.33 8 0l12-8s16-2 22-4c3.16-1.05-6-8-6-8-16-20-24-36-28-56 0 0-1-2-4-2s-4 2-4 2c-4 20-12 36-28 56 0 0-9.16 6.95-6 8z" fill="${hugecolor}" stroke="${strokecolor}"/>
  <path id="tunoP" d="m-13 4c4.98-12.8 6.88-28.5 9-44-4 15-9 29-15 43" fill="${strokecolor}" stroke="${strokecolor}" stroke-width="2"/>
  <use transform="scale(-1,1)" href="#tunoP"/>
</g>`);
    if (parts.includes("tunoa")) {
      svgChildren.push(
        `<use transform="translate(76,-96) rotate(32)" href="#tuno"/>`
      );
    }
    if (parts.includes("tunob")) {
      svgChildren.push(
        `<use transform="translate(-76,-96) rotate(-32)" href="#tuno"/>`
      );
    }
    if (parts.includes("tunoc")) {
      svgChildren.push(
        `<use transform="translate(76,100) rotate(148)" href="#tuno"/>`
      );
    }
    if (parts.includes("tunod")) {
      svgChildren.push(
        `<use transform="translate(-76,100) rotate(212)" href="#tuno"/>`
      );
    }
  }
  if (parts.some((s) => s.startsWith("drill"))) {
    defsChildren.push(`<g id="drill" fill="${greycolor}" stroke="${strokecolor}" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
  <path d="m28-2-27-63-1-2-1 2-28 63c13 10 45 10 57 0z"/>
  <path d="m-11-42c7-1 14-4 17-8m-26 29c12 0 28-6 33-14m-36 36c19-3 36-8 43-19" fill="none"/>
</g>`);
  }
  if (parts.includes("drilla")) {
    svgChildren.push(
      `<use transform="translate(76,-96) rotate(28)" href="#drill"/>`
    );
  }
  if (parts.includes("drillb")) {
    svgChildren.push(
      `<use transform="translate(-76,-96) rotate(-28)" href="#drill"/>`
    );
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
}

// src/puge.ts
function puge({ parts = [], color, viewbox, style }) {
  const svgStyle = color ? getStyleString(color) : "";
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
  if (parts.includes("sumi")) {
    svgChildren.push(`<g stroke="${strokecolor}" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
  <path d="m -40,-76 40,-8 40,8" fill="none"/>
  <path d="m -122,60 h 74 l 16,28 H 0 32 L 48,60 h 74" fill="none"/>
</g>`);
  }
  if (parts.some((s) => s.startsWith("ashi"))) {
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
    if (parts.includes("ashia")) {
      svgChildren.push(`<use href="#ashiP" transform="translate(134)"/>`);
    }
    if (parts.includes("ashib")) {
      svgChildren.push(
        `<use href="#ashiP" transform="translate(-134) scale(-1,1)"/>`
      );
    }
  }
  if (parts.includes("hearta")) {
    svgChildren.push(`<g transform="translate(76,80)" fill="${hugecolor}" stroke="${strokecolor}" stroke-linejoin="round" stroke-width="5" paint-order="stroke">
  <path d="m-13 2c-4-4-5-10-3-14 1-3 5-4 8-3s8 6 8 6 5-6 8-6c3-1 6 1 8 3 2 4 1 10-3 14-3 3-13 9-13 9s-10-6-13-9z"/>
</g>`);
  }
  if (parts.some((s) => s.startsWith("drill"))) {
    defsChildren.push(`<g id="drill" fill="${greycolor}" stroke="${strokecolor}" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
  <path d="m28-2-27-63-1-2-1 2-28 63c13 10 45 10 57 0z"/>
  <path d="m-11-42c7-1 14-4 17-8m-26 29c12 0 28-6 33-14m-36 36c19-3 36-8 43-19" fill="none"/>
</g>`);
    if (parts.includes("drilla")) {
      svgChildren.push(
        `<use transform="translate(98,-94) rotate(36)" href="#drill"/>`
      );
    }
    if (parts.includes("drillb")) {
      svgChildren.push(
        `<use transform="translate(-98,-94) rotate(-36)" href="#drill"/>`
      );
    }
  }
  if (parts.includes("mask")) {
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
}

// src/main.ts
var draw = () => {
  $preview.innerText = "";
  const options = {
    parts: [...new FormData($parts).keys()],
    color: new FormData($color),
    viewbox: new FormData($viewbox)
  };
  $preview.insertAdjacentHTML(
    "beforeend",
    $huge.base.value == "puge" ? puge(options) : orbio(options)
  );
};
$huge.onchange = draw;
$parts.onchange = draw;
var setColor = throttle(() => {
  const $svg = $preview.querySelector("svg");
  if ($svg)
    $svg.style.cssText = getStyleString(new FormData($color));
});
$color.oninput = setColor;
$reset.onclick = (e) => {
  e.preventDefault();
  $color.reset();
  setColor();
};
var clamp = (n, min, max) => Math.min(max, Math.max(min, n));
var toRGB = (h = 138, s = 0.5, v = 1) => {
  h = (h < 0 ? h % 360 + 360 : h) % 360 / 60;
  s = s < 0 ? 0 : s > 1 ? 1 : s;
  v = v < 0 ? 0 : v > 1 ? 1 : v;
  const [r, g, b] = [5, 3, 1].map(
    (n) => Math.round(
      (v - clamp(2 - Math.abs(2 - (h + n) % 6), 0, 1) * s * v) * 255
    )
  );
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, "0")}`;
};
$random.onclick = () => {
  $color.hugecolor.value = toRGB(Math.random() * 360);
  setColor();
};
var setViewbox = throttle(() => {
  $viewbox.querySelectorAll(`label:has([type="range"])`).forEach(($label) => {
    const $span = $label.querySelector("span");
    if ($span) {
      $span.textContent = ("+" + $label.querySelector("input")?.value + "%").replace("+-", "-");
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
      const size = +($svg.getAttributeNS(null, "viewBox")?.match(/\d+$/)?.[0] || "512");
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
setViewbox();
draw();
