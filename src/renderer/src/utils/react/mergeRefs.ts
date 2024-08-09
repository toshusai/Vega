export function mergeRefs<T>(
  ...refs: Array<React.MutableRefObject<T | null> | ((instance: T) => void)>
) {
  const filteredRefs = refs.filter((ref) => ref)
  if (!filteredRefs.length) {
    return null
  }
  if (filteredRefs.length === 0) {
    return filteredRefs[0]
  }
  return (value: T) => {
    for (const ref of filteredRefs) {
      if (typeof ref === 'function') {
        ref(value)
      } else {
        ref.current = value
      }
    }
  }
}
