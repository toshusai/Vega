import { DeepReadOnly } from '../utils/DeepReadOnly'
import { calculateKeyFrameValue } from '../rendering/calculateKeyFrameValue'
import { Effect, KeyFrame, TextEffect } from '@renderer/schemas'
import { getDeepProperties } from '../utils/getDeepProperties'
import { getDeepProperty } from '../utils/getDeepProperty'
import { getStripByEffectId } from '@renderer/components/Preview/getStripByEffectId'
import { assignDeepProperty } from '../utils/assignDeepProperty'

export function getSelectedAnimatedTextEffects(
  effects: DeepReadOnly<Effect[]>,
  currentTime: number,
  fps: number
) {
  return effects
    .map((effect) => {
      const strip = getStripByEffectId(effect.id)
      if (!strip) return null
      const animatedEffect: TextEffect = JSON.parse(JSON.stringify(effect))

      const allKeys = getDeepProperties(effect)
      allKeys.forEach((key) => {
        const value = getDeepProperty(effect, key)
        if (typeof value !== 'number') {
          return
        }
        if (effect.keyframes.length === 0) {
          return
        }
        const newValue = calculateKeyFrameValue(
          effect.keyframes as KeyFrame[],
          currentTime - strip.start,
          key,
          value,
          fps
        )

        assignDeepProperty(animatedEffect, key, newValue)
      })
      return animatedEffect
    })
    .filter((effect) => effect !== null) as DeepReadOnly<TextEffect[]>
}
