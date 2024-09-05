import { useSnapshot } from 'valtio'
import { isTextEffect } from '../rendering/isTextEffect'
import { state } from '../state'
import { Effect } from '../schemas'

export function useSelectedTextEffects() {
  const snap = useSnapshot(state)
  return snap.selectedStripIds.flatMap((id) => {
    const strip = snap.strips.find((strip) => strip.id === id)
    return strip?.effects.filter((effect) => isTextEffect(effect as Effect)) ?? []
  })
}
