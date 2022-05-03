<script setup lang="ts">
import TimeView from "./TimeView.vue";
import ScaleScroll from "../ScaleScroll.vue";
import Cursor from "./Cursor.vue";
const { timeline, changeView, play, update } = useTimeline();

const { addUpdate } = useUpdate();

const { addEventListener } = useContainer();

onMounted(() => {
  addUpdate((d) => {
    if (timeline.value.isPlay) {
      update(timeline.value.curent + d / 1000);
    } else {
      update(timeline.value.curent);
    }
  });
  window.addEventListener("keydown", (e) => {
    if (document.activeElement.tagName == "INPUT") {
      return;
    }
    if (e.key === " ") {
      play(!timeline.value.isPlay);
    }
  });

  addEventListener("resize", () => {
    // 強制的に更新するためEPSILONを足す
    changeView(
      timeline.value.start + Number.EPSILON,
      timeline.value.end + Number.EPSILON
    );
  });
});
</script>

<template>
  <div class="timeline-root">
    <Cursor />
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
  position: relative;
}
</style>
