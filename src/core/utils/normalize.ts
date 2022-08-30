export function normalize (min: number, max: number, value: number) {
  return (value - min) / (max - min)
}
