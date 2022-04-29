<script setup lang="ts">
import TimeView from "./TimeView.vue";
import ScaleScroll from "../ScaleScroll.vue";
const { timeline, changeView } = useTimeline();
</script>

<template>
  <div class="timeline-root">
    <TimeView />
    <PanelsLayer
      v-for="(layer, i) in timeline.layers"
      :key="i"
      :layer="layer"
    />
    <ScaleScroll
      style="position: absolute; bottom: 0"
      :start="timeline.start / timeline.length"
      :end="timeline.end / timeline.length"
      @start="(n) => changeView(n * timeline.length, timeline.end)"
      @end="(n) => changeView(timeline.start, n * timeline.length)"
    />
  </div>
</template>

<style scoped>
.timeline-root {
  overflow: hidden;
  height: calc(100% - 12px);
}
</style>
