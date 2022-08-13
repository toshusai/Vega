export function usePixPerSecTimeline (el: HTMLElement | null | undefined) {
  const { timeline } = useTimeline()
  const viewScale =
    (timeline.value.end - timeline.value.start)
  const scale = viewScale
  return usePixPerSec(el, scale)
}

export function usePixPerSec (el: HTMLElement | null | undefined, visibleSeconds: number) {
  const width = el?.getBoundingClientRect().width || 1
  return width / visibleSeconds
}
