declare const $color: HTMLFormElement;
declare const $random: HTMLInputElement;
declare const $output: HTMLFormElement;
declare const $preview: HTMLElement;
declare const $reset: HTMLInputElement;

interface Options {
  bgcolor: string;
  bodycolor: string;
  strokecolor: string;
  hugecolor: string;
  bgtransparent: "on" | undefined;
  blackcolor?: string;
  greycolor?: string;
  style?: string;
}

function orbio(o: Partial<Options> = {}): string {
  console.log(o);
  o.bgcolor = o.bgtransparent ? "transparent" : o.bgcolor;
  const {
    bgcolor = "#fff",
    bodycolor = "#cccccc",
    strokecolor = "#323232",
    hugecolor = "#80ffa6",
    blackcolor = "#323232",
    greycolor = "#6e6e6e",
  } = o;
  const style = o.style ? `<style>${o.style}</style>` : "";
  return `
<svg viewBox="-256 -256 512 512" xmlns="http://www.w3.org/2000/svg">
${style}<defs>
<radialGradient id="eyeG">
  <stop stop-color="#fff" offset=".5"/>
  <stop stop-color="#000" offset="1"/>
</radialGradient>
<mask id="eyeM">
  <circle r="10" fill="url(#eyeG)"/>  
</mask>
</defs>
<rect x="-256" y="-256" width="100%" height="100%" fill="${bgcolor}"/>
<g stroke="${strokecolor}" stroke-linejoin="round" stroke-width="4">
  <circle r="136" fill="${bodycolor}"/>
  <path d="m-32-56-22 38h-82v36h82l22 38h64l22-38h82v-36h-82l-22-38z" fill="${greycolor}"/>
  <path d="m-28-49-22 37h-86v24h86l22 37h56l21-37h87v-24h-87l-21-37z" fill="${blackcolor}" stroke="none"/>
</g>
<g id="ashi" transform="translate(126)" fill="${bodycolor}" stroke="${strokecolor}" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
  <ellipse rx="10" ry="38" fill="${greycolor}"/>
  <path d="m2-19 41-12v59l-41-9c-3-12-3-25 0-38z"/>
  <path d="m53-172c-8-16-18-21-28-24-4 20-11 37-20 52 12 12 28 116 32 144s4 132 4 132c22 17 26 30 32 44 16-14 21-29 24-44 0-20 4-85-8-156-11-66-24-128-36-148z"/>
  <path d="m37-16c23 3 51 13 52-8m8 156c-4 12-8 20-56 0m12-304c-8-5-10-19-48 28m20-52c41 45 64 192 64 280 0 32 4 64-16 92" fill="none"/>
</g>
<use transform="scale(-1,1)" href="#ashi"/>
<g fill="${hugecolor}">
  <circle id="eyeA" transform="translate(0 -17)" r="10" mask="url(#eyeM)"/>
  <use id="eyeB" transform="translate(-17 28)" href="#eyeA"/>
  <use id="eyeC" transform="translate(17 28)" href="#eyeA"/>
</g>
<g id="hoshi" transform="translate(80 56) rotate(15)">
  <path d="m0-25 10.3 10.8 13.5 6.5-7.2 13.1-1.9 14.8-14.7-2.7-14.7 2.7-1.9-14.8-7.1-13.1 13.5-6.4z" fill="${hugecolor}" stroke="${strokecolor}" stroke-linejoin="round" stroke-width="4"/>
  <path id="hoshiP" d="m-4 17h8l-4-13z" fill="${strokecolor}"/>
  <use transform="rotate(-72)" href="#hoshiP"/>
  <use transform="rotate(216)" href="#hoshiP"/>
  <use transform="rotate(144)" href="#hoshiP"/>
  <use transform="rotate(72)" href="#hoshiP"/>
</g>
<g id="tuno" stroke-linejoin="round" stroke-width="4" transform="rotate(32.5 207 85)">
    <path d="m-38 0c6 2 22 4 22 4l12 8c2.67 1.33 5.33 1.33 8 0l12-8s16-2 22-4c3.16-1.05-6-8-6-8-16-20-24-36-28-56 0 0-1-2-4-2s-4 2-4 2c-4 20-12 36-28 56 0 0-9.16 6.95-6 8z" fill="${hugecolor}" stroke="${strokecolor}"/>
    <path id="tunoP" d="m-13 4c4.98-12.8 6.88-28.5 9-44-4 15-9 29-15 43" fill="${strokecolor}" stroke="${strokecolor}" stroke-width="2"/>
    <use transform="scale(-1,1)" href="#tunoP"/>
</g>
<use transform="scale(-1,1)" href="#tuno"/>
<use transform="scale(1,-1)" href="#tuno"/>
<use transform="scale(-1)" href="#tuno"/>
</svg>
`;
}
let queued = false;
const draw = async () => {
  if (queued) return;
  queued = true;
  await new Promise((r) => setTimeout(r, 100));
  queued = false;
  $preview.innerText = "";
  $preview.insertAdjacentHTML(
    "beforeend",
    orbio(
      Object.fromEntries([...new FormData($color)]) as unknown as Options,
    ),
  );
};
$color.oninput = draw;
$reset.onclick = (e) => {
  e.preventDefault();
  $color.reset();
  draw();
};

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));
const toRGB = (h = 138, s = 0.5, v = 1) => {
  h = (h < 0 ? h % 360 + 360 : h) % 360 / 60;
  s = s < 0 ? 0 : s > 1 ? 1 : s;
  v = v < 0 ? 0 : v > 1 ? 1 : v;
  const [r, g, b] = [5, 3, 1].map((n) =>
    Math.round(
      (v - clamp(2 - Math.abs(2 - (h + n) % 6), 0, 1) * s * v) * 255,
    )
  );
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, "0")}`;
};
$random.onclick = () => {
  $color.hugecolor.value = toRGB(Math.random() * 360);
  draw();
};

const timestamp = () =>
  new Date().toLocaleString("sv").replace(" ", "_").replaceAll(/[^\d_]/g, "");
const download = (url: string, filebase: string, format: string) => {
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filebase}_${timestamp()}.${format}`;
  a.click();
  URL.revokeObjectURL(url);
};

$output.onsubmit = () => {
  const filebase = "orbio";
  const format = $output.format.value;
  console.log({ format });
  const svgText = new XMLSerializer().serializeToString(
    $preview.querySelector("svg")!,
  );
  const svgBlob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
  const svgUrl = URL.createObjectURL(svgBlob);
  if (["png", "jpg", "webp"].includes(format)) {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(svgUrl);
      const canvas = new OffscreenCanvas(512, 512);
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, 512, 512);
      canvas.convertToBlob({
        type: `image/${format === "jpg" ? "jpeg" : format}`,
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

draw();
