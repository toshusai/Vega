import { useSnapshot } from 'valtio'
import { state } from '../../state'

export function useTimelineSeconds(width: number) {
  const snap = useSnapshot(state)
  const defaultPxPerSec = width === 0 ? 100 : width / snap.length
  const pxPerSec = (1 / (snap.viewEndRate - snap.viewStartRate)) * defaultPxPerSec
  const startSec = (snap.viewStartRate * width) / defaultPxPerSec
  return {
    pxPerSec,
    startSec,
  }
}
