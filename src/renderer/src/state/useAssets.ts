import { state } from '@renderer/state'
import { useSnapshot } from 'valtio'

export function useAssets() {
  const snap = useSnapshot(state)
  return snap.assets
}
