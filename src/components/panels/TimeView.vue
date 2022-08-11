<script setup lang="ts">
import { onDragStart } from '~~/src/utils/onDragStart'

const { timeline, update } = useTimeline()

const el = ref<HTMLElement | null>(null)

const pixScale = computed(() => {
  const width = el.value?.getBoundingClientRect().width || 1

  const viewScale =
    (timeline.value.end - timeline.value.start) / timeline.value.length
  return width / timeline.value.length / viewScale
})

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
  update(time, true)
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
  update(timeline.value.curent + Number.EPSILON * 2, true)
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
