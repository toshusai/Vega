export function pointerInRect(
  x: number,
  y: number,
  rect: { left: number; top: number; width: number; height: number }
) {
  return (
    x >= rect.left && x <= rect.left + rect.width && y >= rect.top && y <= rect.top + rect.height
  )
}
