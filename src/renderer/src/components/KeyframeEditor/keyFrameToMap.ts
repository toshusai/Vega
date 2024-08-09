import { KeyFrame } from '@renderer/schemas'

export function keyFrameToMap(keyframes: KeyFrame[]): Record<string, KeyFrame[]> {
  const map: Record<string, KeyFrame[]> = {}
  keyframes.forEach((keyframe) => {
    if (!map[keyframe.property]) {
      map[keyframe.property] = []
    }
    map[keyframe.property].push(keyframe)
  })
  return map
}
