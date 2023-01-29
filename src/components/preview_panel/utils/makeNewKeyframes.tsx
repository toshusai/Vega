import { uuid } from "short-uuid";

import {
  Ease,
  Effect, KeyFrame
} from "@/packages/types";
import { exactKeyFrame } from "@/utils/exactKeyFrame";
import { hasKeyFrame } from "@/utils/hasKeyFrame";
import { roundToFrame } from "@/utils/roundToFrame";


export function makeNewKeyframes<T extends Effect>(
  partial: Partial<T>,
  effect: T,
  currentTime: number,
  strip: { start: number; },
  fps: number
) {
  const changedKeys = Object.keys(partial) as (keyof T)[];
  const newKFs: KeyFrame[] = [];
  changedKeys.forEach((key) => {
    if (hasKeyFrame<T>(effect, key)) {
      const propKey = key as keyof T;
      const value = partial[propKey] as any;
      if (value === undefined) {
        return;
      }
      const onKeyFrame = exactKeyFrame<T>(
        effect,
        key as keyof T,
        currentTime - strip.start
      );
      if (onKeyFrame) {
        newKFs.push({
          ...onKeyFrame,
          value,
        });
      } else {
        newKFs.push({
          id: uuid(),
          property: key.toString(),
          time: roundToFrame(currentTime - strip.start, fps),
          value,
          ease: Ease.Linear,
        });
      }
    }
  });
  if (newKFs.length === 0) {
    return false;
  }

  // drop same time keyframes
  const old = effect.keyframes.filter((keyframe) => {
    return (
      !newKFs.find((kf) => {
        return (
          Math.abs(kf.time - keyframe.time) < 1 / fps &&
          kf.property === keyframe.property
        );
      }) && !newKFs.find((kf) => kf.id === keyframe.id)
    );
  });

  const finalKeyFrames = [...newKFs, ...old];
  return finalKeyFrames;
}
