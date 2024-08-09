import { useSnapshot } from 'valtio'
import { state } from '../state'
import { useMemo } from 'react'
import { useSelectedTextEffects } from './useSelectedTextEffects'
import { getSelectedAnimatedTextEffects } from './getSelectedAnimatedTextEffects'

export function useAnimatedEffects() {
  const effects = useSelectedTextEffects()
  const snap = useSnapshot(state)
  return useMemo(() => {
    return getSelectedAnimatedTextEffects(effects, snap.currentTime, snap.fps)
  }, [effects, snap.currentTime, snap.fps])
}
