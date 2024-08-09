import { state } from '../state'

export function selectedStrips() {
  return state.strips.filter((strip) => state.selectedStripIds.includes(strip.id))
}
