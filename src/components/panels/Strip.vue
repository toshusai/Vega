<script setup lang="ts">
import { Strip } from "~/core/Timeline";
import { onDragStart } from "~~/src/utils/onDragStart";
const props = defineProps<{ strip: Strip }>();

const { timeline, moveStrip, selectStrip } = useTimeline();

const el = ref<HTMLElement | null>(null);

const pixScale = computed(() => {
  const width = el.value?.parentElement.getBoundingClientRect().width || 1;
  const viewScale =
    (timeline.value.end - timeline.value.start) / timeline.value.length;
  return width / timeline.value.scale / viewScale;
});

const style = computed(() => {
  return {
    width: props.strip.length * pixScale.value + "px",
    height: "100%",
    position: "absolute",
    left: (props.strip.start - timeline.value.start) * pixScale.value + "px",
  };
});

function drag(e: MouseEvent) {
  e.preventDefault();

  onDragStart(e, (d, e) => {
    const layerHeight = 20;
    const parent = el.value?.parentElement;
    const parentRect = parent?.getBoundingClientRect();
    const layerIndex = e.clientY - parentRect.top;

    moveStrip(
      props.strip.id,
      props.strip.start + d.x / pixScale.value,
      props.strip.length
    );
  });
}

function moveStart(e: MouseEvent) {
  e.stopPropagation();
  onDragStart(e, (d) => {
    moveStrip(
      props.strip.id,
      props.strip.start + d.x / pixScale.value,
      props.strip.length - d.x / pixScale.value
    );
  });
}

function moveEnd(e: MouseEvent) {
  e.stopPropagation();
  onDragStart(e, (d) => {
    moveStrip(
      props.strip.id,
      props.strip.start,
      props.strip.length + d.x / pixScale.value
    );
  });
}
</script>

<template>
  <div
    ref="el"
    :style="style"
    class="strip"
    :class="
      timeline.selectedStrips.find((x) => x.id == props.strip.id)
        ? 'strip-selected'
        : ''
    "
    @mousedown="drag"
    @click.stop="() => selectStrip([props.strip.id])"
  >
    <div class="handle" @mousedown="moveStart"></div>
    <div class="handle" style="right: 0" @mousedown="moveEnd"></div>
  </div>
</template>

<style scoped>
.strip {
  border: 1px solid lightblue;
  background-color: lightblue;
  box-sizing: border-box;
  cursor: pointer;
}

.strip-selected {
  background-color: red;
}

.handle {
  position: absolute;
  width: 4px;
  background-color: darkblue;
  height: 100%;
  cursor: ew-resize;
}
</style>
