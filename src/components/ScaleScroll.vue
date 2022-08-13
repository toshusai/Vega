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
  onDragStart(e, (d) => {
    emit('start', Math.max(props.start + d.x / width, 0))
  })
}
function moveEnd (e: MouseEvent) {
  e.stopPropagation()
  const width = el.value?.getBoundingClientRect().width || 0
  onDragStart(e, (d) => {
    emit('end', Math.min(props.end + d.x / width, 1))
  })
}
function moveView (e: MouseEvent) {
  e.stopPropagation()
  const width = el.value?.getBoundingClientRect().width || 0
  onDragStart(e, (d) => {
    const start = props.start + d.x / width
    if (start < 0) {
      return
    }
    const max = props.end + d.x / width
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
  <div
    ref="el"
    style="height: 12px; width: 100%; position: relative"
    @mousedown.stop="() => {}"
  >
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
        :style="{
          left: `1px`
        }"
        @mousedown="moveStart"
      />
      <div
        class="handle"
        :style="{
          right: `1px`
        }"
        @mousedown="moveEnd"
      />
    </div>
  </div>
</template>

<style scoped>
.bg {
  position: absolute;
  background: #222;
  height: 12px;
}

.handle {
  position: absolute;
  background: #333;
  height: 10px;
  width: 10px;

  top: 1px;
  cursor: pointer;
  box-sizing: border-box;
  user-select: none;
}

.handle:hover {
  background-color: var(--teal-800);
}

.fill {
  position: absolute;
  user-select: none;
  border-radius: 6px;
  cursor: pointer;
}
</style>
