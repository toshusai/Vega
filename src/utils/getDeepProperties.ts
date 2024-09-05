export function getDeepProperties<T>(obj: T, path: string = ''): string[] {
  const keys: string[] = []
  for (const key in obj) {
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      keys.push(...getDeepProperties(obj[key], path ? `${path}.${key}` : key))
    } else {
      keys.push(path ? `${path}.${key}` : key)
    }
  }
  return keys
}
