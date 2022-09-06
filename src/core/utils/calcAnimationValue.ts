import { normalize } from './normalize'
import { easeInOutCubic } from './easeInOutCubic'
import { Animation } from '@/core'

export function findBetween (
  animations: Animation[],
  time: number,
  key: string
) {
  let prev = -1
  for (let i = 0; i < animations.length; i++) {
    if (animations[i].key !== key) {
      continue
    }
    if (animations[i].time <= time) {
      prev = i
    }
  }

  const prevAnimation = prev !== -1 ? animations[prev] : null

  let next = -1
  for (let i = animations.length - 1; i >= 0; i--) {
    if (animations[i].key !== key) {
      continue
    }
    if (animations[i].time >= time) {
      next = i
    }
  }

  // if (prev !== 1 && next !== -1 && prev >= next) { return [null, null] }

  const nextAnimation = next !== -1 ? animations[next] : null
  return [prevAnimation, nextAnimation]
}

const animFuncMap: Record<string, (x: number) => number> = {
  easeInOutCubic,
  liner: x => x
}

export function calcAnimationValue (
  animations: Animation[],
  time: number,
  key: string,
  defaultValue = 0,
  animFunc = 'liner'
) {
  if (animations.filter(a => a.key === key).length === 0) {
    return defaultValue
  }
  const [prev, next] = findBetween(animations, time, key)

  let v = defaultValue
  if (prev && next) {
    if (prev === next) {
      return prev?.value
    }
    v =
      prev.value +
      animFuncMap[animFunc](normalize(prev.time, next.time, time)) *
        (next.value - prev.value)
  } else if (prev && !next) {
    v = prev.value
  } else if (next && !prev) {
    v = next.value
  }
  return v
}
