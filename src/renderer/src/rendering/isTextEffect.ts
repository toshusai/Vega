import { Effect, TextEffect } from '../schemas'
import { DeepReadOnly } from '../utils/DeepReadOnly'

export function isTextEffect(effect: Effect | DeepReadOnly<Effect>): effect is TextEffect {
  return effect.type === 'text'
}
