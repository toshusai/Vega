<script setup lang="ts">
import { Animation } from "../core/TextStripEffect";

const props = defineProps<{ animation: Animation; scale: number }>();

const { timeline, selectKeyframe } = useTimeline();

const HEIGHT = 24;
const SIZE = 12;

const style = computed(() => {
  return {
    top: `${HEIGHT / 2 - SIZE / 2}px`,
    left: `${props.animation.time * props.scale - SIZE / 2}px`,
  };
});

const selected = computed(() => {
  return timeline.value.selectedKeyframes.includes(props.animation);
});

function select() {
  selectKeyframe([props.animation]);
}
</script>

<template>
  <div :style="style" class="keyframe-marker cursor-pointer">
    <svg
      :class="selected ? `selected` : ``"
      :style="`width: ${SIZE}px; height: ${SIZE}px`"
      viewBox="0 0 24 24"
      @click="select"
    >
      <path
        d="M12 2C11.5 2 11 2.19 10.59 2.59L2.59 10.59C1.8 11.37 1.8 12.63 2.59 13.41L10.59 21.41C11.37 22.2 12.63 22.2 13.41 21.41L21.41 13.41C22.2 12.63 22.2 11.37 21.41 10.59L13.41 2.59C13 2.19 12.5 2 12 2Z"
      />
    </svg>
  </div>
</template>

<style scoped>
.keyframe-marker {
  position: absolute;
  margin: auto 0;
  fill: currentColor;
}
.selected {
  fill: orange;
}
</style>
