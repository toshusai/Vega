/**
 * manage open state of inspector effect collapses
 */
import { cacheStore } from '@/utils'

const getKey = (id: string) => `inspector-container-${id}`

export const getCache = (id: string) => {
  const v = cacheStore[getKey(id)]
  if (v === undefined) {
    return true
  }
  return false
}

export const setCache = (id: string, v: boolean) => {
  cacheStore[getKey(id)] = v
}
