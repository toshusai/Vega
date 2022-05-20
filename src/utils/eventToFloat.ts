export function eventToFloat(e: Event) {
  if (e.target instanceof HTMLInputElement) {
    return Number.parseFloat(e.target.value);
  }
  return 0;
}
