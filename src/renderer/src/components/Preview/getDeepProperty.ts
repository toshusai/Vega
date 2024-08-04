export function getDeepProperty(obj: object, path: string): string | number | boolean | undefined {
  const keys = path.split('.')
  let current = obj
  for (const key of keys) {
    if (current[key] === undefined) {
      return undefined
    }
    current = current[key]
  }
  if (typeof current === 'object') {
    return undefined
  }
  return current
}
