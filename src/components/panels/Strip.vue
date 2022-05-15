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

  const layerHeight = 20;
  const parent = el.value?.parentElement.parentElement;
  const parentRect = parent?.getBoundingClientRect();
  onDragStart(e, (d, e) => {
    const layerIndex = Math.floor((e.clientY - parentRect.top) / layerHeight);
    if (layerIndex < 0) return;

    moveStrip(
      props.strip.id,
      props.strip.start + d.x / pixScale.value,
      props.strip.length,
      layerIndex
    );
  });
}

function moveStart(e: MouseEvent) {
  e.stopPropagation();
  onDragStart(e, (d) => {
    moveStrip(
      props.strip.id,
      props.strip.start + d.x / pixScale.value,
      props.strip.length - d.x / pixScale.value,
      props.strip.layer
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
  background-color: rgb(148, 211, 250);
}

.handle {
  position: absolute;
  width: 4px;
  background-color: darkblue;
  height: 100%;
  cursor: ew-resize;
}
</style>
