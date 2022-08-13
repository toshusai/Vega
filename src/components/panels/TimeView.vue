<script setup lang="ts">
import { onDragStart } from '~~/src/utils/onDragStart'

const emits = defineEmits<{
  (e: 'move', t: number): void
}>()

const { timeline } = useTimeline()

const el = ref<HTMLElement | null>(null)

const pixScale = computed(() => usePixPerSec(el.value))

const secs = computed(() => {
  const times = []

  for (let i = Math.round(timeline.value.start); i < timeline.value.end; i++) {
    times.push({
      time: i,
      left: (i - timeline.value.start) * pixScale.value
    })
  }
  return times
})

function setTime (e: MouseEvent) {
  const xleft = el.value?.getBoundingClientRect().left || 0
  const x = e.clientX - xleft
  const left = el.value?.parentElement?.getBoundingClientRect().left || 1

  const time = (x - left) / pixScale.value + timeline.value.start
  emits('move', time)
}

function dragStart (e: MouseEvent) {
  setTime(e)
  onDragStart(e, (_, e) => {
    setTime(e)
  })
  // block select rectangle
  e.stopPropagation()
}

onMounted(() => {
  // foce update first view
})
</script>

<template>
  <div
    ref="el"
    class="view"
    style="
      height: 20px;
      font-size: 4px;
      line-height: 20px;
      border-bottom: 1px solid;
      position: relative;
      overflow: hidden;
    "
    @mousedown="dragStart"
  >
    <div
      v-for="(sec, i) in secs"
      :key="i"
      class="sec"
      style="border-left: 1px solid; padding-left: 1px"
      :style="{ position: 'absolute', left: sec.left + 'px' }"
    >
      {{ sec.time }}
    </div>
  </div>
</template>

<style scoped>
.view {
  cursor: pointer;
  user-select: none;
}
</style>
