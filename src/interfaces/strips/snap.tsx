import { Strip } from "@/core/types";
import { roundToFrame } from "@/utils/roundToFrame";

export function snap(
  newStart: number,
  newLength: number,
  allSnapPoints: number[],
  strip: Strip,
  fps: number,
  keepStart: boolean,
  keepEnd: boolean
) {
  allSnapPoints = allSnapPoints.sort((a, b) => a - b);
  const snapStartPositionToOtherStrips = () => {
    let minDiff = 100000;
    let minDiffPoint = null;
    for (const p of allSnapPoints) {
      const diff = Math.abs(p - newStart);
      if (diff < minDiff) {
        minDiff = diff;
        minDiffPoint = p;
      }
    }
    return minDiffPoint;
  };

  const snapEndPositionToOtherStrips = () => {
    let minDiff = 100000;
    let minDiffPoint = null;
    for (const p of allSnapPoints) {
      const diff = Math.abs(p - (newStart + newLength));
      if (diff < minDiff) {
        minDiff = diff;
        minDiffPoint = p;
      }
    }
    return minDiffPoint;
  };
  const snapStart = snapStartPositionToOtherStrips();
  if (snapStart !== null && !keepStart) {
    newStart = snapStart;
    const snapDiff = snapStart - strip.start;
    if (keepEnd) {
      newLength = roundToFrame(strip.length - snapDiff, fps);
    }
  } else {
    const snapEnd = snapEndPositionToOtherStrips();
    if (snapEnd !== null && !keepEnd) {
      if (!keepStart) {
        newStart = roundToFrame(snapEnd - newLength, fps);
      }
      newLength = roundToFrame(snapEnd - newStart, fps);
    }
  }
  return { newStart, newLength };
}
