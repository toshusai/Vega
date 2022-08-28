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
  <div :id="containerId" class="panel" @mouseenter="mouseenter" @mouseleave="mouseleave">
    <!-- TODO implement all direction -->
    <!-- <layout-change-area
      v-if="dad.key === 'layout' && enter && dad.payload !== props.containerId"
      @top="e => upTop(e, 'top')"
      @left="e => upTop(e, 'left')"
      @right="e => upTop(e, 'right')"
      @bottom="e => upTop(e, 'bottom')"
    /> -->
    <div>
      <div class="name" @mousedown="e => startDad(e, 'layout', props.containerId)">
        {{ props.name }}
      </div>
    </div>
    <div style="height: calc(100% - 12px)">
      <component :is="'' + props.name.toLowerCase() + '-panel'" />
    </div>
  </div>
</template>

<style scoped>
.panel {
  display: block;
  width: 100%;
  overflow: hidden;
  border: 1px solid white;
  box-sizing: border-box;
  height: 100%;
}

.name {
  border-bottom: 1px solid;
  font-size: 12px;
  line-height: 12px;
  padding-top: 1px;
  padding-left: 2px;
  height: 16px;
  cursor: pointer;
  box-sizing: border-box;
}
</style>
