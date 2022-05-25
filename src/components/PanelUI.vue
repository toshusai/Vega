<script setup lang="ts">
import { Position } from '../core/Container'

const props = defineProps<{ name: string; containerId: string }>()
const { dad, startDad } = useDragAndDrop()

const enter = ref(false)
const mouseenter = (_e: MouseEvent) => {
  enter.value = true
}
const mouseleave = (_e: MouseEvent) => {
  enter.value = false
}

const { changeLayout } = useContainer()
const upTop = (e: MouseEvent, pos: Position) => {
  changeLayout({
    from: dad.value.payload || '',
    to: props.containerId,
    pos
  })
}
</script>

<template>
  <div
    :id="containerId"
    class="panel overflow-hidden"
    @mouseenter="mouseenter"
    @mouseleave="mouseleave"
  >
    <LayoutChangeArea
      v-if="dad.key == 'layout' && enter && dad.payload != props.containerId"
      @top="(e) => upTop(e, 'top')"
      @left="(e) => upTop(e, 'left')"
      @right="(e) => upTop(e, 'right')"
      @bottom="(e) => upTop(e, 'bottom')"
    />
    <div>
      <div
        class="name border-default border-b"
        @mousedown="(e) => startDad(e, 'layout', props.containerId)"
      >
        {{ props.name }}
      </div>
    </div>
    <div style="height: calc(100% - 12px)">
      <component :is="'Panels' + props.name + 'Panel'" />
    </div>
  </div>
</template>

<style scoped>
.panel {
  display: block;
  width: 100%;
  height: 100%;
  padding: 2px;
}

.name {
  font-size: 12px;
  line-height: 12px;
  cursor: pointer;
  box-sizing: border-box;
}
</style>
