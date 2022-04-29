<script setup lang="ts">
import { onDragStart } from "../utils/onDragStart";

const props = defineProps<{
  start: number;
  end: number;
}>();

const emit = defineEmits<{
  (e: "start", n: number): void;
  (e: "end", n: number): void;
}>();

const el = ref<HTMLElement>(null);

function moveStart(e: MouseEvent) {
  e.stopPropagation();
  const width = el.value?.getBoundingClientRect().width || 0;
  onDragStart(e, (d) => {
    emit("start", Math.max(props.start + d.x / width, 0));
  });
}
function moveEnd(e: MouseEvent) {
  e.stopPropagation();
  const width = el.value?.getBoundingClientRect().width || 0;
  onDragStart(e, (d) => {
    emit("end", Math.min(props.end + d.x / width, 1));
  });
}
function moveView(e: MouseEvent) {
  e.stopPropagation();
  const width = el.value?.getBoundingClientRect().width || 0;
  onDragStart(e, (d) => {
    const start = props.start + d.x / width;
    if (start < 0) return;
    const max = props.end + d.x / width;
    if (max > 1) return;
    emit("start", Math.max(start, 0));
    emit("end", Math.min(max, 1));
  });
}
</script>

<template>
  <div ref="el" style="height: 12px; width: 100%; position: relative">
    <div
      class="fill"
      :style="{
        left: props.start * 100 + '%',
        width: (props.end - props.start) * 100 + '%',
      }"
      @mousedown="moveView"
    ></div>

    <div
      class="handle"
      :style="{
        left: props.start * 100 + '%',
      }"
      @mousedown="moveStart"
    ></div>
    <div
      class="handle"
      :style="{
        left: 'calc(' + props.end * 100 + '% - 8px)',
      }"
      @mousedown="moveEnd"
    ></div>
  </div>
</template>

<style scoped>
.handle {
  position: absolute;
  top: 0;
  left: 0;
  width: 12px;
  height: 12px;
  background-color: gray;
  border-radius: 6px;
  cursor: pointer;
  border: 2px solid black;
  box-sizing: border-box;
}
.fill {
  position: absolute;
  top: 0;
  height: 12px;
  background-color: black;
  border-radius: 6px;
  cursor: pointer;
}
</style>
