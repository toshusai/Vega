import { useSnapshot } from 'valtio'
import { state } from '../../state'

export function useLayerLength() {
  const snap = useSnapshot(state)
  return snap.strips.reduce((acc, strip) => Math.max(acc, strip.layer), 0) + 1
}
