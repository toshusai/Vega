/* eslint-disable @typescript-eslint/ban-ts-comment */
export function getDeepProperty(obj: object, path: string): string | number | boolean | undefined {
  const keys = path.split('.')
  let current = obj
  for (const key of keys) {
    // @ts-ignore
    if (current[key] === undefined) {
      return undefined
    }
    // @ts-ignore
    current = current[key]
  }
  if (typeof current === 'object') {
    return undefined
  }
  return current
}
