import { clamp, HSV, toHSV, toRGB } from "./util.ts";

export const initColorPicker = (dom: HTMLElement) => {
  const $palette = dom.querySelector<HTMLElement>(".palette");
  const $thumb = dom.querySelector<HTMLElement>(".thumb");
  const $hue = dom.querySelector<HTMLInputElement>(`input[name="hue"]`);
  const $saturation = dom.querySelector<HTMLOutputElement>(
    `[name="saturation"]`,
  );
  const $brightness = dom.querySelector<HTMLOutputElement>(
    `[name="brightness"]`,
  );
  if (!$palette || !$thumb || !$hue || !$saturation || !$brightness) {
    throw new Error("dom is not ColorPicker");
  }

  let target: HTMLInputElement;
  const state: HSV = { h: 138, s: 0.5, v: 1 };
  const setTarget = ($input: HTMLInputElement) => {
    target = $input;
    setHSV(toHSV(target.value));
  };
  const setHSV = ({ h, s, v }: Partial<HSV>, needsRGB = false) => {
    if (h != void 0 && h != state.h) {
      state.h = h;
      $hue.valueAsNumber = h;
      dom.style.setProperty("--picked-hue", "" + h);
      needsRGB = true;
    }
    if (s != void 0 && s != state.s) {
      state.s = s;
      $thumb.style.setProperty("left", `${100 * s}%`);
      needsRGB = true;
    }
    if (v != void 0 && v != state.v) {
      state.v = v;
      $thumb.style.setProperty("top", `${100 - 100 * v}%`);
      needsRGB = true;
    }
    if (target && needsRGB) {
      target.value = toRGB(...Object.values(state));
      target.dispatchEvent(
        new InputEvent("input", { bubbles: true, cancelable: true }),
      );
    }
  };
  const { width: paletteWidth, height: paletteHeight } = $palette
    .getBoundingClientRect();
  $hue.oninput = () => {
    setHSV({ h: $hue.valueAsNumber });
  };
  const handlePointerMove = (e: PointerEvent) => {
    if (e.buttons == 1) {
      $palette.setPointerCapture(e.pointerId);
      const top = clamp(e.offsetY, 0, paletteHeight);
      const left = clamp(e.offsetX, 0, paletteWidth);
      setHSV({ s: left / paletteWidth, v: 1 - top / paletteHeight });
      // $thumb.style.setProperty("top", top + "px");
      // $thumb.style.setProperty("left", left + "px");
      // saturation = ;
      // brightness = 1 - top / paletteHeight;
    }
  };
  $palette.onpointermove = handlePointerMove;
  $palette.onpointerdown = handlePointerMove;

  document.querySelectorAll<HTMLInputElement>(`input[type="color"]`)
    .forEach(($input) =>
      $input.addEventListener("click", (e) => {
        if ($input.disabled || !$input.name) return;
        e.preventDefault();
        setTarget($input);
      })
    );
};
