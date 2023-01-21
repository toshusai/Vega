import { Strip } from "../interfaces/Strip";
import { roundToFrame } from "./roundToFrame";
import { snap } from "./snap";

export function moveStrip(
  strip: Strip,
  diffX: number,
  diffY: number,
  pxPerSec: number,
  fps: number,
  keepEnd: boolean,
  keepStart: boolean,
  timelineLength: number,
  withoutSelectedStrips: Strip[]) {
  let newStart = roundToFrame(strip.start + diffX / pxPerSec, fps);
  let newLength = strip.length;
  if (keepEnd) {
    newLength = roundToFrame(strip.length - diffX / pxPerSec, fps);
  }
  if (keepStart) {
    newLength = roundToFrame(strip.length + diffX / pxPerSec, fps);
    newStart = strip.start;
  }

  // handle snap
  let allSnapPoints: number[] = [0, timelineLength];
  withoutSelectedStrips.forEach((s) => {
    allSnapPoints.push(s.start);
    allSnapPoints.push(s.start + s.length);
  });
  const snaped = snap(
    newStart,
    newLength,
    allSnapPoints,
    strip,
    fps,
    keepStart,
    keepEnd
  );
  newStart = snaped.newStart;
  newLength = snaped.newLength;

  const newLayer = roundToFrame(strip.layer + Math.round(diffY / 44), fps);
  const newStrip = {
    ...strip,
    start: newStart,
    length: newLength,
    layer: newLayer,
  };
  return newStrip;
}
