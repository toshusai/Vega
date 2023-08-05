export function roundToFrame(time: number, fps: number) {
  return Math.floor(time * fps) / fps;
}

export function floorFrame(time: number, fps: number) {
  return Math.round(time * fps);
}
