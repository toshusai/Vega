export function getNearestPoints(selfPoints: number[], targetPoints: number[], threshold: number) {
  let minPoint = Infinity;
  let targetP: number | null = null;
  let snapDiff = 0;
  for (const selfPoint of selfPoints) {
    for (const targetPoint of targetPoints) {
      const diff = Math.abs(selfPoint - targetPoint);
      if (diff < threshold) {
        if (minPoint > diff) {
          targetP = targetPoint;
          minPoint = Math.min(minPoint, Math.abs(selfPoint - targetPoint));
          snapDiff = targetPoint - selfPoint;
        }
        break;
      }
    }
  }

  return {
    targetP,
    snapDiff
  };
}
