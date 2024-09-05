import { state } from '@/state'
import { useSnapshot } from 'valtio'

export function useAssets() {
  const snap = useSnapshot(state)
  return snap.assets
}
