declare const $color: HTMLFormElement;
declare const $random: HTMLInputElement;
declare const $output: HTMLFormElement;
declare const $preview: HTMLElement;
declare const $reset: HTMLInputElement;

interface Options {
  bgcolor: string;
  bodycolor: string;
  strokecolor: string;
  shadowcolor: string;
  hugecolor: string;
  bgtransparent: "on" | undefined;
}

function orbio(o: Partial<Options> = {}): string {
  console.log(o);
  const {
    bgcolor = "#fff",
    bodycolor = "#cccccc",
    strokecolor = "#323232",
    shadowcolor = "#323232",
    hugecolor = "#80ffa6",
  } = o;
  const bg = o.bgtransparent
    ? ""
    : `<rect width="512" height="512" fill="${bgcolor}"/>`;
  return `
<svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<defs>
<radialGradient id="d" cx="256" cy="256" r="12" gradientTransform="matrix(.783 0 0 .783 55.5 38)" gradientUnits="userSpaceOnUse">
  <stop stop-color="${hugecolor}" offset=".501"/>
  <stop stop-color="${hugecolor}" stop-opacity="0" offset=".903"/>
</radialGradient>
</defs>
${bg}
<circle cx="256" cy="257" r="136" fill="${bodycolor}" stroke="${strokecolor}" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"/>
<path d="m225 203-25.8 40.1h-78.5a136 136 0 0 0-1.01 14.1 136 136 0 0 0 1.01 14.1h78.5l25.8 40.1h61.9l25.8-40.1h78.5a136 136 0 0 0 1.01-14.1 136 136 0 0 0-0.748-14.1h-78.8l-25.8-40.1z" fill="${shadowcolor}"/>
<path d="m225 200a3.52 3.52 0 0 0-2.96 1.62l-24.7 38.5h-76.4a136 136 0 0 0-0.505 7.05h78.8a3.52 3.52 0 0 0 2.96-1.62l24.7-38.5h58.1l24.7 38.5a3.52 3.52 0 0 0 2.96 1.62h79.1a136 136 0 0 0-0.732-7.05h-76.4l-24.7-38.5a3.52 3.52 0 0 0-2.96-1.62zm-105 68.3a136 136 0 0 0 0.505 7.05h76.4l24.7 38.5a3.52 3.52 0 0 0 2.96 1.62h61.9a3.52 3.52 0 0 0 2.96-1.62l24.7-38.5h76.4a136 136 0 0 0 0.505-7.05h-78.8a3.52 3.52 0 0 0-2.96 1.62l-24.7 38.5h-58.1l-24.7-38.5a3.52 3.52 0 0 0-2.96-1.62z" fill="#6e6e6e" stroke="${strokecolor}" stroke-linecap="round" stroke-linejoin="round" stroke-width="4"/>

<circle id="b" cx="256" cy="239" r="9.4" fill="url(#d)" style="paint-order:fill markers stroke"/>
<use transform="translate(-16.4 28.2)" xlink:href="#b"/>
<use transform="translate(16.4 28.2)" xlink:href="#b"/>

<g transform="matrix(.325 .218 -.218 .325 309 177)" stroke-linecap="square" stroke-linejoin="round">
  <path d="m256 192 28.1 25.4 32.8 18.8-15.5 34.5-7.77 37-37.6-4.05-37.6 4.05-7.77-37-15.5-34.5 32.8-18.8z" fill="${hugecolor}" style="paint-order:fill markers stroke"/>
  <path d="m256 186a6 6 0 0 0-4.03 1.55l-27.6 25-32.3 18.5a6 6 0 0 0-2.49 7.66l15.2 33.9 7.64 36.4a6 6 0 0 0 6.52 4.73l37-3.98 37 3.98a6 6 0 0 0 6.52-4.73l7.64-36.4 15.2-33.9a6 6 0 0 0-2.49-7.66l-32.3-18.5-27.6-25a6 6 0 0 0-4.03-1.55zm0 14.1 19.4 17.5-14.7 31.9 25.8-23.8 22.7 13-10.7 23.8-34.9-4.09 30.6 17.2-5.37 25.6-26-2.8-6.89-34.4-6.89 34.4-26 2.8-5.37-25.6 30.6-17.2-34.9 4.09-10.7-23.8 22.7-13 25.8 23.8-14.7-31.9z" fill="${strokecolor}" style="paint-order:fill markers stroke"/>
</g>

<g id="a" transform="matrix(.503 .303 -.303 .503 254 1.28)">
  <path d="m256 42.2s-13.8 79.8-60 112c-11.1 7.71 13.8 10.7 60 11.5 46.2-0.87 71.1-3.81 60-11.5-46.2-32-60-112-60-112 0 0.564-9e-3 1.2-9e-3 1.77-3.3e-4 -0.567-9e-3 -1.2-9e-3 -1.77z" fill="${hugecolor}" style="paint-order:fill markers stroke"/>
  <path d="m256 39.6a2.63 2.63 0 0 0-1.05 1.14 2.63 2.63 0 0 0-1.34 1.03s-3.4 19.7-12.5 43.4c-9.12 23.7-24 51.2-46.4 66.7-1.61 1.12-2.87 2.22-3.49 3.95-0.618 1.73 0.153 3.94 1.4 5.08 2.49 2.28 6.19 3.12 11.7 4.05 11 1.86 28.8 2.8 51.9 3.23a2.63 2.63 0 0 0 0.0977 0c23.1-0.436 40.9-1.37 51.9-3.23 5.48-0.932 9.18-1.77 11.7-4.05 1.24-1.14 2.01-3.35 1.4-5.08-0.618-1.73-1.88-2.84-3.49-3.95-22.4-15.5-37.3-43-46.4-66.7-9.12-23.7-12.5-43.4-12.5-43.4a2.63 2.63 0 0 0-1.34-1.03 2.63 2.63 0 0 0-1.26-0.973 2.63 2.63 0 0 0-0.215-0.166zm0.215 14.7c1.98 8.2 5.04 19.3 10.2 32.7 9.32 24.2 24.4 52.6 48.3 69.2 0.854 0.592 0.955 0.815 1.12 1.02-0.859 0.553-3.82 1.75-8.58 2.56-5.66 0.963-13.8 1.67-23.6 2.2l-19.6-70.5a1.18 1.18 0 0 0-1.37-0.834 1.18 1.18 0 0 0-0.924 1.31l9.83 70.5c-3.99 0.138-8.3 0.242-12.7 0.336h-5.31c-4.42-0.0937-8.71-0.199-12.7-0.336l9.83-70.5a1.18 1.18 0 0 0-2.29-0.479l-19.6 70.5c-9.82-0.532-17.9-1.24-23.6-2.2-4.76-0.81-7.72-2-8.58-2.56 0.164-0.203 0.265-0.426 1.12-1.02 23.9-16.5 39-44.9 48.3-69.2 5.17-13.4 8.23-24.5 10.2-32.7z" fill="${strokecolor}" style="paint-order:fill markers stroke"/>
</g>
<use id="c" transform="matrix(-1 0 0 1 512 -7.09e-8)" xlink:href="#a"/>
<use transform="matrix(1 0 0 -1 0 512)" xlink:href="#a"/>
<use transform="matrix(1 0 0 -1 0 512)" xlink:href="#c"/>
<ellipse id="f" cx="383" cy="257" rx="9.4" ry="37.6" fill="#6e6e6e" stroke="${strokecolor}" stroke-linejoin="round" stroke-width="4" style="paint-order:fill markers stroke"/>
<path id="e" d="m385 239 25.8-9.4v56.4l-25.8-9.4c-3.13-12.5-3.13-25.1 0-37.6z" fill="${bodycolor}" stroke="${strokecolor}" stroke-linejoin="round" stroke-width="4" style="paint-order:fill markers stroke"/>
<use transform="matrix(-1,0,0,1,512,0)" xlink:href="#f"/>
<use transform="matrix(-1,0,0,1,512,0)" xlink:href="#e"/>
<g id="g" transform="matrix(.795 0 0 .795 52.4 50.8)" stroke-width="5.03">
  <path d="m428 16s-17.7 23.6-21.4 63.3c15.4 48.8 29.1 101 37.5 179 8.33 78.2 10.4 114 5.67 164 12 38.1 34.3 57.5 34.3 57.5s16.7-14.6 20.5-39.9c5.7-37.6 4.49-101-4.78-188-9.96-93.2-26.6-165-43.8-204-9.55-21.6-28-32-28-32z" fill="${bodycolor}" style="paint-order:fill markers stroke"/>
  <path d="m440 232c31 18.5 56 32 56-8m-68-208 12 24c40 152 70.3 287 48 416l-3.91 24m-77.4-401s17.4-31.3 33.4-39.3c4.92-2.46 16 8 16 8m-6.22 374s22.9 26 38.2 25.5c6.66-0.181 17.8-17.4 17.8-17.4m-77.8-415s-17.7 23.6-21.4 63.3c15.4 48.8 29.1 101 37.5 179 8.33 78.2 10.4 114 5.67 164 12 38.1 34.3 57.5 34.3 57.5s16.7-14.6 20.5-39.9c5.7-37.6 4.49-101-4.78-188-9.4-88-30.1-163-43.8-204-8-24-28-32-28-32z" fill="none" stroke="${strokecolor}" stroke-linejoin="round" stroke-width="5.03" style="paint-order:fill markers stroke"/>
</g>
<use transform="matrix(-1,0,0,1,512,0)" xlink:href="#g"/>
</svg>
`;
}

const draw = () => {
  $preview.innerText = "";
  $preview.insertAdjacentHTML(
    "beforeend",
    orbio(
      Object.fromEntries([...new FormData($color)]) as unknown as Options,
    ),
  );
};

$color.onchange = draw;
$reset.onclick = () => {
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
