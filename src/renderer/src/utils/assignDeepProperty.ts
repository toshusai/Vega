export function assignDeepProperty<T>($obj: T, path: string, value: string | number | boolean) {
  const keys = path.split('.')
  let current = $obj
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (current[key] === undefined) {
      current[key] = {}
    }
    current = current[key]
  }
  current[keys[keys.length - 1]] = value
}
