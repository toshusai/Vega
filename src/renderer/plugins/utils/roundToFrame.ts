export function roundToFrame(time: number, fps: number) {
  const step = 1 / fps;
  const d = Math.round(time / step);
  return d * step;
}
