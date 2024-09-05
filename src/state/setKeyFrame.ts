import { Effect, KeyFrame } from '@/schemas'
import { state } from '@/state'
import { assignDeepProperty } from '../utils/assignDeepProperty'

export function setKeyFrame($effect: Effect, keyframe: KeyFrame, add: boolean = false) {
  const threshold = 1 / state.fps

  const nearest = $effect.keyframes
    .filter((k) => k.property === keyframe.property)
    .find((k) => Math.abs(k.time - keyframe.time) < threshold)

  if (nearest) {
    nearest.value = keyframe.value
  } else {
    if (!add && $effect.keyframes.filter((k) => k.property === keyframe.property).length === 0) {
      assignDeepProperty($effect, keyframe.property, keyframe.value)
    } else {
      $effect.keyframes.push(keyframe)
    }
  }
}
