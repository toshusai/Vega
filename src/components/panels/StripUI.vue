<script setup lang="ts">
import { CSSProperties } from "vue";
import { Strip } from "~~/src/core/Strip";
import { onDragStart } from "~~/src/utils/onDragStart";
const props = defineProps<{ strip: Strip }>();

const { timeline, moveStrip, selectStrip } = useTimeline();

const layerHeight = 50;
const el = ref<HTMLElement | null>(null);

const pixScale = computed(() => {
  const width = el.value?.parentElement?.getBoundingClientRect().width || 1;
  const viewScale =
    (timeline.value.end - timeline.value.start) / timeline.value.length;
  return width / timeline.value.scale / viewScale;
});

const style = computed<CSSProperties>(() => {
  return {
    width: props.strip.length * pixScale.value + "px",
    position: "absolute",
    top: props.strip.layer * layerHeight + 1 + "px",
    left: (props.strip.start - timeline.value.start) * pixScale.value + "px",
  };
});

function drag(e: MouseEvent) {
  e.preventDefault();

  const parent = el.value?.parentElement;
  const parentRect = parent?.getBoundingClientRect();
  if (!parentRect) return;

  const startProps = { ...props.strip };
  let startStart = startProps.start;
  onDragStart(e, (d, e) => {
    const layerIndex = Math.floor((e.clientY - parentRect.top) / layerHeight);
    if (layerIndex < 0) return;
    startStart += d.x / pixScale.value;
    moveStrip(startProps.id, startStart, startProps.length, layerIndex);
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

function getComponentNameFromStrip(strip: Strip) {
  for (let i = 0; i < strip.effects.length; i++) {
    const effect = strip.effects[i];
    if (effect.type == "Text") {
      return "PanelsTextStripUI";
    } else if (effect.type == "Video") {
      return "PanelsVideoStripUI";
    }
  }
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
    <component
      :is="getComponentNameFromStrip(props.strip)"
      :strip="props.strip"
    />
    <div class="handle" style="right: 0" @mousedown="moveEnd"></div>
  </div>
</template>

<style scoped>
.strip {
  background-color: var(--teal-200);
  border: 4px solid var(--teal-200);
  box-sizing: border-box;
  cursor: pointer;
  height: 48px;
}

.strip-selected {
  /* background-color: var(--teal-500); */
  border: 4px solid var(--teal-50);
  box-sizing: border-box;
}

.handle {
  position: absolute;
  top: 0;
  width: 8px;
  background-color: var(--teal-300);
  height: 100%;
  cursor: ew-resize;
}
</style>
