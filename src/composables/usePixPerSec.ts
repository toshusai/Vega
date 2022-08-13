export function usePixPerSec (el?: HTMLElement | null) {
  const { timeline } = useTimeline()
  const width = el?.getBoundingClientRect().width || 1
  // 0(start) to 1(length)
  const viewScale =
    (timeline.value.end - timeline.value.start) / timeline.value.length
  return width / timeline.value.length / viewScale
}
