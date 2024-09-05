/* eslint-disable @typescript-eslint/ban-ts-comment */
export function assignDeepProperty<T extends object>(
  $obj: T,
  path: string,
  value: string | number | boolean,
) {
  const keys = path.split('.')
  let current = $obj
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (current === null || !(typeof current === 'object')) {
      return
    }
    if (key in current) {
      // @ts-ignore
      if (current[key] === undefined) {
        // @ts-ignore
        current[key] = {}
      }
    }
    // @ts-ignore
    current = current[key]
  }
  // @ts-ignore
  current[keys[keys.length - 1]] = value
}
