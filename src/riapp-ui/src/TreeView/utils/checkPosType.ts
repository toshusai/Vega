export enum PosType {
  Top,
  Bottom,
  Middle,
}

export function checkPosType(e: MouseEvent) {
  if (e.target instanceof HTMLElement) {
    const rect = e.target.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = rect.height;
    if (y < height / 3) {
      return PosType.Top;
    } else if (y > (height * 2) / 3) {
      return PosType.Bottom;
    } else {
      return PosType.Middle;
    }
  } else {
    console.error("currentTarget is not HTMLElement", e.target);
  }
}

export function checkPosType2(e: MouseEvent) {
  if (e.target instanceof HTMLElement) {
    const rect = e.target.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = rect.height;
    if (y < height / 2) {
      return PosType.Top;
    } else {
      return PosType.Bottom;
    }
  } else {
    console.error("currentTarget is not HTMLElement", e.target);
  }
}
