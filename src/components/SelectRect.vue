<script setup lang="ts">
const { timeline, selectStrip } = useTimeline()

const props = defineProps<{
  element: HTMLElement
}>()

const isDraging = ref(false)
const left = ref(0)
const top = ref(0)
const width = ref(0)
const height = ref(0)

const startX = ref(0)
const startY = ref(0)

const stripElements = ref<HTMLElement[]>([])

const el = ref<HTMLElement | null>(null)

onMounted(() => {
  props.element.addEventListener('mousedown', (e) => {
    stripElements.value = []
    timeline.value.strips.forEach((strip) => {
      const el = document.getElementById(`strip-${strip.id}`)
      if (el) {
        stripElements.value.push(el)
      }
    })
    isDraging.value = true
    const parentRect = props.element.getBoundingClientRect()
    startX.value = e.clientX - parentRect.left
    startY.value = e.clientY - parentRect.top
  })
  window.addEventListener('mousemove', (e) => {
    if (!isDraging.value) {
      return
    }
    const parentRect = props.element.getBoundingClientRect()
    const cx = e.clientX - parentRect.left
    const cy = e.clientY - parentRect.top
    left.value = cx < startX.value ? cx : startX.value
    top.value = cy < startY.value ? cy : startY.value
    width.value = Math.abs(cx - startX.value)
    height.value = Math.abs(cy - startY.value)

    const selfRect = el.value?.getBoundingClientRect()
    if (!selfRect) {
      return
    }

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
    // filter by newStripIds
    const selectedStrips = timeline.value.strips
      .filter((strip) => {
        return newStripIds.includes(`strip-${strip.id}`)
      })
      .map(s => s.id)

    selectStrip(selectedStrips)
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
  <div v-show="isDraging" ref="el" class="select-rect" :style="style" />
</template>

<style scoped>
.select-rect {
  background: rgba(96, 96, 255, 0.1);
  position: absolute;
  border: 1px solid rgba(96, 96, 255, 0.2);
  box-sizing: border-box;
  pointer-events: none;
  z-index: 3;
}
</style>
