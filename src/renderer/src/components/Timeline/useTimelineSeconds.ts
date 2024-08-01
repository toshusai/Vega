import { useSnapshot } from 'valtio'
import { state } from '.'

export function useTimelineSeconds(width: number) {
  const snap = useSnapshot(state)
  const defaultPxPerSec = 100
  const pxPerSec = (1 / (snap.viewEndRate - snap.viewStartRate)) * defaultPxPerSec
  const startSec = (snap.viewStartRate * width) / defaultPxPerSec
  return {
    pxPerSec,
    startSec
  }
}
