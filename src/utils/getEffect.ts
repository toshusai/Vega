import { Strip, StripEffect } from '@/core'

export function getEffect<T = StripEffect> (strip: Strip, type: string) {
  return strip.effects.find(e => e.type === type) as T | undefined
}
