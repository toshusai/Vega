import { Strip } from "../Strip";
import { roundToFrame } from "../../utils/roundToFrame";

export function snap(
  newStart: number,
  newLength: number,
  allSnapPoints: number[],
  strip: Strip,
  fps: number,
  keepStart: boolean,
  keepEnd: boolean) {
  allSnapPoints = allSnapPoints.sort((a, b) => a - b);
  const snapStartPositionToOtherStrips = () => {
    const snapPoints = allSnapPoints.filter(
      (p) => Math.abs(p - newStart) < 0.4
    );
    if (snapPoints.length > 0) {
      return snapPoints[0];
    }
    return null;
  };

  const snapEndPositionToOtherStrips = () => {
    const snapPoints = allSnapPoints.filter(
      (p) => Math.abs(p - (newStart + newLength)) < 0.4
    );
    if (snapPoints.length > 0) {
      return snapPoints[0];
    }
    return null;
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
