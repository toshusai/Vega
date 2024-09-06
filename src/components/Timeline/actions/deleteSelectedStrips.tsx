import { state } from '@/state'
import { commit } from '@/state/UndoManager'

export function deleteSelectedStrips() {
  state.strips = state.strips.filter((strip) => !state.selectedStripIds.includes(strip.id))
  state.selectedStripIds = []
  commit()
}
