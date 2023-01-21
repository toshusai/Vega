export enum Ease {
  Linear = "linear",
  EaseInSine = "easeInSine",
  EaseOutSine = "easeOutSine",
  EaseOutQuart = "easeOutQuart",
  EaseInExpo = "easeInExpo",
  EaseInOutQuad = "easeInOutQuad",
  EaseOutBack = "easeOutBack",
  EaseInCubic = "easeInCubic",
}

export function getEasingFunction(ease: Ease) {
  switch (ease) {
    case Ease.Linear:
      return linear;
    case Ease.EaseInSine:
      return easeInSine;
    case Ease.EaseOutSine:
      return easeOutSine;
    case Ease.EaseOutQuart:
      return easeOutQuart;
    case Ease.EaseInExpo:
      return easeInExpo;
    case Ease.EaseInOutQuad:
      return easeInOutQuad;
    case Ease.EaseOutBack:
      return easeOutBack;
    case Ease.EaseInCubic:
      return easeInCubic;
    default:
      return linear;
  }
}

export function linear(x: number): number {
  return x;
}

export function easeInSine(x: number): number {
  return 1 - Math.cos((x * Math.PI) / 2);
}

export function easeOutSine(x: number): number {
  return Math.sin((x * Math.PI) / 2);
}

export function easeOutQuart(x: number): number {
  return 1 - Math.pow(1 - x, 4);
}

export function easeInExpo(x: number): number {
  return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
}

export function easeInOutQuad(x: number): number {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}

export function easeOutBack(x: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;

  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

export function easeInCubic(x: number): number {
  return x * x * x;
}
