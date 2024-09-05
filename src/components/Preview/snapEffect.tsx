import { state } from '../../state';
import { Ease, TextEffect } from '@/schemas';
import { setKeyFrame } from '../../state/setKeyFrame';
import { randomId } from '../../utils/randomId';
import { getStripByEffectId } from './getStripByEffectId';
import { getNearestPoints } from './getNearestPoints';
import { getAllSnapTargetPoints } from './getAllSnapTargetPoints';
import { snapState } from '.';


export function snapEffect(
  newX: number,
  newY: number,
  width: number,
  height: number,
  ids: string[],
  /**
   * mutable
   */
  $effect: TextEffect,
  threshold: number
) {
  const selfHPoints = [newX, newX + width / 2, newX - width / 2];
  const selfVPoints = [newY, newY + height / 2, newY - height / 2];

  const { targetHPoints, targetVPoints } = getAllSnapTargetPoints(ids);

  snapState.points = [];
  const { targetP: ph, snapDiff: diffX } = getNearestPoints(selfHPoints, targetHPoints, threshold);
  if (ph) {
    snapState.points.push({
      direction: 'vertical',
      value: ph
    });
    $effect.x = newX + diffX;
  } else {
    $effect.x = newX;
  }

  const { targetP: pv, snapDiff: diffY } = getNearestPoints(selfVPoints, targetVPoints, threshold);
  if (pv) {
    snapState.points.push({
      direction: 'horizontal',
      value: pv
    });
    $effect.y = newY + diffY;
  } else {
    $effect.y = newY;
  }

  const hasKeyframe = $effect.keyframes.length > 0;
  if (hasKeyframe) {
    const strip = getStripByEffectId($effect.id);
    if (!strip) return;
    const keyframe = {
      time: state.currentTime - strip.start,
      ease: Ease.Linear
    };
    setKeyFrame($effect, { ...keyframe, property: 'x', value: $effect.x, id: randomId() });
    setKeyFrame($effect, { ...keyframe, property: 'y', value: $effect.y, id: randomId() });
  }

  return {
    diffX,
    diffY
  };
}
