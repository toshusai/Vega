
export function roundToFrame(time: number, fps: number) {
  return Math.floor(time * fps) / fps;
}
