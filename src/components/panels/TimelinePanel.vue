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

const layers = computed(() => {
  const l = [[], [], [], []];
  for (const strip of timeline.value.strips) {
    if (l.length <= strip.layer) {
      for (let i = l.length; i <= strip.layer; i++) {
        l.push([]);
      }
    }
    l[strip.layer].push(strip);
  }
  return l;
});
</script>

<template>
  <div class="timeline-root">
    <Cursor />
    <TimeView />
    <div>
      <PanelsLayer v-for="(layer, i) in layers" :key="i" :strips="layer" />
    </div>
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
