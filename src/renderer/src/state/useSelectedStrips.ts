import { useSnapshot } from 'valtio'
import { state } from '../state'

export function useSelectedStrips() {
  const snap = useSnapshot(state)
  return snap.strips.filter((strip) => snap.selectedStripIds.includes(strip.id))
}
