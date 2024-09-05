import { state } from '../../state';
import { measureMapState } from '../../rendering/updateTextEffect';
import { stripIsVisible } from '../../rendering/stripIsVisible';

export function getAllSnapTargetPoints(ids: string[]) {
  const targetHPoints: number[] = [];
  const targetVPoints: number[] = [];
  measureMapState.forEach((value, key) => {
    if (ids.includes(key)) {
      return;
    }
    const sp = state.strips.find((strip) => strip.id === key);
    if (sp && !stripIsVisible(sp, state.currentTime, state.fps)) {
      return;
    }
    targetHPoints.push(value.left, value.left + value.width / 2, value.left + value.width);
    targetVPoints.push(value.top, value.top + value.height / 2, value.top + value.height);
  });

  return {
    targetHPoints,
    targetVPoints
  };
}
