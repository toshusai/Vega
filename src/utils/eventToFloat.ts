export function eventToFloat(e: Event) {
  if (
    e.target instanceof HTMLInputElement ||
    e.target instanceof HTMLSelectElement
  ) {
    return Number.parseFloat(e.target.value);
  }
  return 0;
}
