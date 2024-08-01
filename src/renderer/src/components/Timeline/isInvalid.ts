import { state } from '../../state'

export function isInvalid(id: string) {
  if (!state.selectedStripIds.includes(id)) return false
  const currentStrip = state.strips.find((strip) => strip.id === id)
  if (!currentStrip) return true
  const sameLayerStrips = state.strips.filter((strip) => currentStrip.layer === strip.layer)
  if (sameLayerStrips.length === 1) return false

  const sortedStrips = sameLayerStrips.sort((a, b) => a.start - b.start)
  const index = sortedStrips.findIndex((strip) => strip.id === id)
  if (index === 0) return currentStrip.start + currentStrip.length > sortedStrips[index + 1].start
  if (index === sortedStrips.length - 1)
    return currentStrip.start < sortedStrips[index - 1].start + sortedStrips[index - 1].length

  return (
    currentStrip.start + currentStrip.length > sortedStrips[index + 1].start ||
    currentStrip.start < sortedStrips[index - 1].start + sortedStrips[index - 1].length
  )
}
