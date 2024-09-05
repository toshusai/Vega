export function checkSnap(value: number, snapPoints: number[], threshold = 8) {
  for (const snapPoint of snapPoints) {
    if (Math.abs(value - snapPoint) < threshold)
      return {
        value: snapPoint,
        isSnapped: true,
      }
  }
  return { value, isSnapped: false }
}
