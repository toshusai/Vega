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

const el = ref<HTMLElement | null>(null);

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
  <div
    ref="el"
    style="height: 20px; width: 100%; position: relative; padding: 4px 0"
    class="bg-surface2"
  >
    <div
      class="fill bg-surface3 top-[4px] absolute h-[12px]"
      :style="{
        left: `calc(${props.start * 100}% + 2px)`,
        width: `calc(${(props.end - props.start) * 100}% - 4px)`,
      }"
      @mousedown="moveView"
    >
      <div
        class="handle bg-surface1 rounded-8 h-[10px] w-[10px]"
        :style="{
          left: `1px`,
        }"
        @mousedown="moveStart"
      ></div>
      <div
        class="handle bg-surface1 rounded-8 h-[10px] w-[10px]"
        :style="{
          right: `1px`,
        }"
        @mousedown="moveEnd"
      ></div>
    </div>
  </div>
</template>

<style scoped>
.handle {
  position: absolute;
  top: 1px;
  cursor: pointer;
  box-sizing: border-box;
  user-select: none;
}
.fill {
  position: absolute;
  user-select: none;
  border-radius: 6px;
  cursor: pointer;
}
</style>
