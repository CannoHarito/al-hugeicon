import { clamp, HSV, toHSV, toRGB } from "./util.ts";

declare const $colorpicker: HTMLFieldSetElement;
declare const $colorpallet: HTMLDivElement;
declare const $colorSV: HTMLDivElement;
declare const $colorH: HTMLInputElement;

let target: HTMLInputElement;
const state: HSV = { h: 138, s: 0.5, v: 1 };
export const setPicker = ($input?: HTMLInputElement) => {
  if ($input) target = $input;
  setHSV(toHSV(target.value));
  target?.insertAdjacentElement("afterend", $colorpicker);
};
const setHSV = ({ h, s, v }: Partial<HSV>, needsRGB = false) => {
  if (h != void 0 && h != state.h) {
    state.h = h;
    $colorH.valueAsNumber = h;
    $colorpicker.style.setProperty("--picked-hue", h.toString());
    needsRGB = true;
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
    target.value = toRGB(...Object.values(state));
    target.dispatchEvent(
      new InputEvent("input", { bubbles: true, cancelable: true }),
    );
  }
};
const handlePointerMove = (e: PointerEvent) => {
  if (e.buttons == 1) {
    $colorpallet.setPointerCapture(e.pointerId);
    const { width, height } = $colorpallet.getBoundingClientRect();
    const v = clamp(1 - e.offsetY / height, 0, 1);
    const s = clamp(e.offsetX / width, 0, 1);
    setHSV({ s, v });
  }
};

export const initColorPicker = (
  inputs: HTMLInputElement[],
  { initTarget = inputs.at(-1) } = {},
) => {
  $colorH.oninput = () => {
    setHSV({ h: $colorH.valueAsNumber });
  };
  $colorpallet.onpointermove = handlePointerMove;
  $colorpallet.onpointerdown = handlePointerMove;

  inputs.forEach(($input) => {
    $input.addEventListener("click", (e) => {
      if ($input == target || $input.disabled || !$input.name) return;
      e.preventDefault();
      setPicker($input);
    });
    $input.addEventListener("input", () => {
      if ($input == target) setHSV(toHSV(target.value));
    });
  });
  setPicker(initTarget);
};
