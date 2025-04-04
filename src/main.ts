import { getStyleString, getViewboxString, throttle } from "./util.ts";
import { orbio } from "./orbio.ts";
import { puge } from "./puge.ts";

declare const $huge: HTMLFormElement;
declare const $parts: HTMLFormElement;
declare const $color: HTMLFormElement;
declare const $random: HTMLInputElement;
declare const $output: HTMLFormElement;
declare const $viewbox: HTMLFormElement;
declare const $preview: HTMLElement;
declare const $reset: HTMLInputElement;

const draw = () => {
  $preview.innerText = "";
  const options = {
    parts: [...new FormData($parts).keys()],
    color: new FormData($color),
    viewbox: new FormData($viewbox),
  };
  $preview.insertAdjacentHTML(
    "beforeend",
    $huge.base.value == "puge" ? puge(options) : orbio(options),
  );
};
$huge.onchange = draw;
$parts.onchange = draw;

const setColor = throttle(() => {
  const $svg = $preview.querySelector("svg");
  if ($svg) $svg.style.cssText = getStyleString(new FormData($color));
});
$color.oninput = setColor;
$reset.onclick = (e) => {
  e.preventDefault();
  $color.reset();
  setColor();
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
  setColor();
};

const setViewbox = throttle(() => {
  $viewbox.querySelectorAll(`label:has([type="range"])`).forEach(($label) => {
    const $span = $label.querySelector("span");
    if ($span) {
      $span.textContent = ("+" + $label.querySelector("input")?.value + "%")
        .replace("+-", "-");
    }
  });
  const $svg = $preview.querySelector("svg");
  if ($svg) {
    $svg.setAttributeNS(
      null,
      "viewBox",
      getViewboxString(new FormData($viewbox)),
    );
  }
});
$viewbox.oninput = setViewbox;

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
  const $svg = $preview.querySelector("svg");
  if (!$svg) throw new Error("svg not found");
  const svgText = new XMLSerializer().serializeToString($svg);
  const svgBlob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
  const svgUrl = URL.createObjectURL(svgBlob);
  if (["png", "jpg", "webp"].includes(format)) {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(svgUrl);
      const size = 512;
      const canvas = new OffscreenCanvas(size, size);
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, size, size);
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

setViewbox();
draw();
