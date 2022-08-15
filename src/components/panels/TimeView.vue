<script setup lang="ts">
import { onDragStart } from '~~/src/utils/onDragStart'
import { snap } from '~~/src/utils/snap'

const emits = defineEmits<{
  (e: 'move', t: number): void
}>()

const props = defineProps<{
  start: number
  length: number
}>()

const el = ref<HTMLElement | null>(null)

const pixScale = computed(() => usePixPerSec(el.value, props.length))

const r = [...Array(10)].map((_, i) => 2 ** i)
const secs = computed(() => {
  const times = []
  const x = Math.ceil(pixScale.value / 80)
  const nx = r.find(r => r >= x) || 1
  const step = (1 / nx)
  let j = 0
  for (
    let i = Math.floor(props.start);
    i < props.start + props.length;
    i += step
  ) {
    const time = snap(Math.floor(props.start) + j * step)
    let str = time.toFixed(0)
    str += '.'
    times.push({
      time: str + time.toFixed(3).padEnd(3, '0').split('.')[1],
      left: (time - props.start) * pixScale.value,
      type: time % 1 === 0 ? 'time' : 'time-half'
    })
    j++
  }
  return times
})

function setTime (e: MouseEvent) {
  const screenX = el.value?.getBoundingClientRect().left || 0
  const relativeX = e.clientX - screenX

  const time = (relativeX) / pixScale.value + props.start
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
      width: 100%;
      position: relative;
      overflow: hidden;
    "
    @mousedown="dragStart"
  >
    <div
      v-for="(sec, i) in secs"
      :key="i"
      class="sec"
      style="padding-left: 1px"
      :style="{
        position: 'absolute',
        left: sec.left + 'px',
        bottom: '0',
        lineHeight: '12px',
        borderLeft: sec.type === 'time' ? '1px solid white' : '1px solid gray',
        color: sec.type === 'time' ? 'white' : 'gray',
        height: sec.type === 'time' ? '20px' : '12px'
      }"
    >
      <div
        :style="{
          position: 'absolute',
          bottom: '0',
          transformOrigin: 'left bottom',
          transform: sec.type === 'time' ? 'scale(1)' : 'scale(0.8)'
        }"
      >
        {{ sec.time }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.view {
  cursor: pointer;
  user-select: none;
}
</style>
