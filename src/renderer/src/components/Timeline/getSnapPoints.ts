import { state } from '.'

export function getSnapPoints(ids: string[]): number[] {
  const otherStrips = state.strips.filter((strip) => !ids.includes(strip.id))
  return otherStrips
    .flatMap((strip) => [strip.start, strip.start + strip.length])
    .sort((a, b) => a - b)
}
