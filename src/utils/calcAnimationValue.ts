import { Animation } from "../core/TextStripEffect";
import { easeInOutCubic } from "./easeInOutCubic";
import { normalize } from "./normalize";

export function findBetween(
  animations: Animation[],
  time: number,
  key: string
) {
  let prev = -1;
  for (let i = 0; i < animations.length; i++) {
    if (animations[i].key !== key) continue;
    if (animations[i].time < time) {
      prev = i;
    }
  }

  const prevAnimation = prev !== -1 ? animations[prev] : null;

  let next = -1;
  for (let i = animations.length - 1; i >= 0; i--) {
    if (animations[i].key !== key) continue;
    if (animations[i].time > time) {
      next = i;
    }
  }

  const nextAnimation = next !== -1 ? animations[next] : null;
  return [prevAnimation, nextAnimation];
}

export function calcAnimationValue(
  animations: Animation[],
  time: number,
  key: string,
  defaultValue = 0
) {
  if (animations.filter((a) => a.key == key).length == 0) return defaultValue;
  const [prev, next] = findBetween(animations, time, key);

  let v = defaultValue;
  if (prev && next) {
    v =
      prev.value +
      easeInOutCubic(normalize(prev.time, next.time, time)) *
        (next.value - prev.value);
  } else if (prev && !next) {
    v = prev.value;
  } else if (next && !prev) {
    v = next.value;
  }
  return v;
}
