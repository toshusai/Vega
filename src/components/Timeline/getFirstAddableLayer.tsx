import { state } from '@/state'

export function getFirstAddableLayer(minLength: number) {
  let layer = 0

  state.strips.forEach((strip) => {
    if (
      state.currentTime > strip.start - minLength &&
      state.currentTime < strip.start + strip.length
    ) {
      layer = Math.max(layer, strip.layer + 1)
    }
  })

  return layer
}
