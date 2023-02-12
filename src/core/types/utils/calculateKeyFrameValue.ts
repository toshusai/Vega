import { Ease, getEasingFunction, KeyFrame } from "../../../core";

export function calculateKeyFrameValue(
  keyframes: KeyFrame[],
  currentTime: number,
  property: string | number | symbol,
  defaultValue: number,
  fps: number
) {
  const prevKeyframe = keyframes
    .filter((k) => k.property === property && k.time < currentTime + 1 / fps)
    .sort((a, b) => b.time - a.time)[0];
  const nextKeyframe = keyframes
    .filter((k) => k.property === property && k.time > currentTime - 1 / fps)
    .sort((a, b) => a.time - b.time)[0];

  if (!prevKeyframe && nextKeyframe) {
    return nextKeyframe.value;
  }
  if (prevKeyframe && !nextKeyframe) {
    return prevKeyframe.value;
  }
  if (prevKeyframe && nextKeyframe) {
    let ratio =
      (currentTime - prevKeyframe.time) /
      (nextKeyframe.time - prevKeyframe.time);
    const ease = getEasingFunction(prevKeyframe.ease || Ease.Linear);
    if (isNaN(ratio) || ratio === Infinity || ratio === -Infinity) {
      ratio = 0;
    }
    return (
      prevKeyframe.value +
      (nextKeyframe.value - prevKeyframe.value) * ease(ratio)
    );
  }
  return defaultValue;
}
