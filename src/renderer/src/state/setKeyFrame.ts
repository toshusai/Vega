import { Effect, KeyFrame } from '@renderer/schemas'
import { state } from '@renderer/state'
import { assignDeepProperty } from '../utils/assignDeepProperty'

export function setKeyFrame($effect: Effect, keyframe: KeyFrame) {
  const threshold = 1 / state.fps

  const nearest = $effect.keyframes
    .filter((k) => k.property === keyframe.property)
    .find((k) => Math.abs(k.time - keyframe.time) < threshold)

  if (nearest) {
    nearest.value = keyframe.value
  } else {
    if ($effect.keyframes.filter((k) => k.property === keyframe.property).length === 0) {
      assignDeepProperty($effect, keyframe.property, keyframe.value)
    } else {
      $effect.keyframes.push(keyframe)
    }
  }
}
