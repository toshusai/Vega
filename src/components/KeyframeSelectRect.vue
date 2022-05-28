<script setup lang="ts">
import { Animation } from '../core/TextStripEffect'

const { timeline, selectStrip, selectKeyframe } = useTimeline()

const isDraging = ref(false)
const left = ref(0)
const top = ref(0)
const width = ref(0)
const height = ref(0)

const startX = ref(0)
const startY = ref(0)

const stripElements = ref<HTMLElement[]>([])

const el = ref<HTMLElement | null>(null)

const selected = computed(() => {
  return timeline.value.selectedStrips.find(x => true)
})

onMounted(() => {
  if (!el.value) { return }
  const parent = el.value.parentElement as HTMLElement

  parent.addEventListener('mousedown', (e) => {
    if (!selected.value) { return }
    stripElements.value = []
    selected.value?.effects.forEach((e) => {
      if (e.animations) {
        e.animations.forEach((a) => {
          const el = document.getElementById(`${a.id}`)
          if (el) {
            stripElements.value.push(el)
          }
        })
      }
    })
    isDraging.value = true
    const parentRect = parent.getBoundingClientRect()
    startX.value = e.clientX - parentRect.left
    startY.value = e.clientY - parentRect.top
  })
  window.addEventListener('mousemove', (e) => {
    if (!isDraging.value) { return }
    if (!selected.value) { return }
    const parentRect = parent.getBoundingClientRect()
    const cx = e.clientX - parentRect.left
    const cy = e.clientY - parentRect.top
    left.value = cx < startX.value ? cx : startX.value
    top.value = cy < startY.value ? cy : startY.value
    width.value = Math.abs(cx - startX.value)
    height.value = Math.abs(cy - startY.value)

    const selfRect = el.value?.getBoundingClientRect()
    if (!selfRect) { return }

    const newStripIds: string[] = []
    stripElements.value.forEach((el) => {
      // check contact selfRect and rect
      const rect = el.getBoundingClientRect()
      if (
        rect.left < selfRect.right &&
                rect.right > selfRect.left &&
                rect.top < selfRect.bottom &&
                rect.bottom > selfRect.top
      ) {
        newStripIds.push(el.id)
      }
    })

    const selectedAnimations: Animation[] = []
    selected.value.effects.forEach((e) => {
      e.animations.forEach((a) => {
        if (newStripIds.includes(`${a.id}`)) {
          selectedAnimations.push(a)
        }
      })
    })

    selectKeyframe(selectedAnimations)
  })
  window.addEventListener('mouseup', (e) => {
    e.stopPropagation()
    isDraging.value = false
    left.value = 0
    top.value = 0
    width.value = 0
    height.value = 0
  })
})

const style = computed(() => {
  return {
    left: `${left.value}px`,
    top: `${top.value}px`,
    width: `${width.value}px`,
    height: `${height.value}px`
  }
})
</script>

<template>
  <div v-show="isDraging" ref="el" class="select-rect absolute" :style="style" />
</template>

<style scoped>
.select-rect {
    user-select: none;
    background: rgba(96, 96, 255, 0.1);
    border: 1px solid rgba(96, 96, 255, 0.2);
    box-sizing: border-box;
    pointer-events: none;
    z-index: 3;
}
</style>
