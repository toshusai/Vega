/**
 *
 * @param start 0~1
 * @param end 0~1
 * @param length
 * @param minimun
 * @returns
 */

export function restrictStartEnd(
  start: number,
  end: number,
  length: number,
  minimun: number
) {
  if (start < 0) {
    start = 0;
  }
  if (start > 1) {
    start = 1;
  }
  if (end < 0) {
    end = 0;
  }
  if (end > 1) {
    end = 1;
  }
  if ((end - start) * length < minimun) {
    if (start <= 0) {
      return [0, minimun / length];
    } else if (end >= 1) {
      return [1 - minimun / length, 1];
    } else {
      return [start, start + minimun / length];
    }
  } else {
    return [start, end];
  }
}
