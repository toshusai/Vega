export function eventToString (e: Event) {
  if (e.target instanceof HTMLInputElement) {
    return e.target.value
  }
  return ''
}
