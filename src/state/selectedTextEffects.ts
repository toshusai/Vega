import { isTextEffect } from '../rendering/isTextEffect'
import { state } from '../state'
import { TextEffect } from '@/schemas'

export function selectedTextEffects() {
  return state.selectedStripIds.flatMap((id) => {
    const strip = state.strips.find((strip) => strip.id === id)
    return strip?.effects.filter((effect) => isTextEffect(effect)) ?? []
  }) as TextEffect[]
}
