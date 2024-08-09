import { Effect, PostProcessEffect } from '../schemas'
import { DeepReadOnly } from '../utils/DeepReadOnly'

export function isPostProcessEffect(
  effect: Effect | DeepReadOnly<Effect>
): effect is PostProcessEffect {
  return effect.type === 'postProcess'
}
