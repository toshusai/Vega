const ONE_FRAME = 1 / 60
export function snap (time: number) {
  return Math.floor(time / ONE_FRAME) * ONE_FRAME
}
