<script setup lang="ts">
import { getScrollbarWidth } from '../../utils/getScrollbarWidth'
const { timeline } = useTimeline()
const el = ref<HTMLElement | null>(null)
const pixScale = computed(() => {
  const w = getScrollbarWidth()
  const width = (el.value?.parentElement?.getBoundingClientRect().width || 1) + w
  const viewScale =
    (timeline.value.end - timeline.value.start) / timeline.value.length
  return width / timeline.value.scale / viewScale
})
</script>
<template>
  <div
    ref="el"
    class="cursor"
    :style="{
      left: (timeline.curent - timeline.start) * pixScale + 'px',
    }"
  >
    <svg fill="red">
      <path d="M-8 0 L0 8 L8 0 Z" />
    </svg>
  </div>
</template>
<style scoped>
.cursor {
  position: absolute;
  pointer-events: none;
  top: 0;
  left: 0;
  width: 1px;
  height: calc(1000px);
  background: red;
  z-index: 2;
}
</style>
