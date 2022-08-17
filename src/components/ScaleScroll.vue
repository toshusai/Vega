<script setup lang="ts">
import { onDragStart } from '../utils/onDragStart'

const props = defineProps<{
  start: number
  end: number
}>()

const emit = defineEmits<{
  (e: 'start', n: number): void
  (e: 'end', n: number): void
}>()

const el = ref<HTMLElement | null>(null)

function moveStart (e: MouseEvent) {
  e.stopPropagation()
  const width = el.value?.getBoundingClientRect().width || 0
  const ss = props.start
  onDragStart(e, (_, __, sd) => {
    emit('start', Math.max(ss + sd.x / width, 0))
  })
}
function moveEnd (e: MouseEvent) {
  e.stopPropagation()
  const width = el.value?.getBoundingClientRect().width || 0
  const se = props.end
  onDragStart(e, (_, __, sd) => {
    emit('end', Math.min(se + sd.x / width, 1))
  })
}
function moveView (e: MouseEvent) {
  e.stopPropagation()
  const width = el.value?.getBoundingClientRect().width || 0
  const ss = props.start
  const se = props.end
  onDragStart(e, (_, __, sd) => {
    const start = ss + sd.x / width
    if (start < 0) {
      return
    }
    const max = se + sd.x / width
    if (max > 1) {
      return
    }
    emit('start', Math.max(start, 0))
    emit('end', Math.min(max, 1))
  })
}

onMounted(() => {
  window.addEventListener('resize', () => {
    emit('start', props.start + Number.EPSILON)
    emit('end', props.end + Number.EPSILON)
  })
})
</script>

<template>
  <div ref="el" style="height: 12px; width: 100%; position: relative; background: #222" @mousedown.stop="() => { }">
    <div
      class="bg"
      :style="{
        left: `calc(${props.start * 100}% + 0px)`,
        width: `calc(${(props.end - props.start) * 100}% - 0px)`
      }"
      @mousedown="moveView"
    >
      <div
        class="handle"
        @mousedown="moveStart"
      />
      <div
        class="handle"
        :style="{
          right: `0px`
        }"
        @mousedown="moveEnd"
      />
    </div>
  </div>
</template>

<style scoped>
.bg {
  position: absolute;
  background: #333;
  height: 12px;
  cursor: pointer;
}

.bg:hover {
  background: #444;
}

.handle {
  position: absolute;
  background: #555;
  height: 12px;
  width: 12px;
  cursor: pointer;
  box-sizing: border-box;
  user-select: none;
}

.handle:hover {
  background-color: #666;
}

.fill {
  position: absolute;
  user-select: none;
  border-radius: 6px;
  cursor: pointer;
}
</style>
