<script setup lang="ts">
import TimeView from "./TimeView.vue";
import ScaleScroll from "../ScaleScroll.vue";
import Cursor from "./Cursor.vue";
import { Strip } from "~~/src/core/Strip";
const { timeline, changeView, play, update } = useTimeline();

const { addUpdate } = useUpdate();

const { addEventListener } = useContainer();

const el = ref<HTMLDivElement | null>(null);

onMounted(() => {
  if (!el.value) return;
  el.value.addEventListener("wheel", (e) => {
    e.preventDefault();
    if (e.ctrlKey) {
      const zoomSize = e.deltaY * 0.01;
      const start = timeline.value.start - zoomSize;
      const end = timeline.value.end + zoomSize;
      changeView(start, end);
    }

    const scale = 0.01;
    let start = timeline.value.start + e.deltaX * scale;
    if (start < 0) {
      changeView(0, timeline.value.end);
      return;
    }
    let end = timeline.value.end + e.deltaX * scale;
    if (end > timeline.value.length) {
      changeView(timeline.value.start, timeline.value.length);
      return;
    }
    changeView(start, end);
  });
  addUpdate((d) => {
    if (timeline.value.isPlay) {
      update(timeline.value.curent + d / 1000);
    } else {
      update(timeline.value.curent);
    }
  });
  window.addEventListener("keydown", (e) => {
    if (document.activeElement?.tagName == "INPUT") {
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
  const l: Strip[][] = [[], [], [], []];
  for (const strip of timeline.value.strips) {
    if (l.length <= strip.layer) {
      for (let i = l.length; i <= strip.layer; i++) {
        l.push([]);
      }
    }
    l[strip.layer].push(strip as Strip);
  }
  return l;
});

const strips = computed<Strip[]>(() => {
  return timeline.value.strips as Strip[];
});
</script>

<template>
  <div ref="el" class="timeline-root">
    <div style="width: 100px; border-right: 1px solid var(--border-grey)">
      <div
        style="
          height: 20px;
          border-bottom: 1px solid var(--border-grey);
          box-sizing: border-box;
        "
      ></div>
      <div
        v-for="(layer, i) in layers"
        :key="i"
        :style="`
          border-bottom: 1px solid var(--border-grey);
          height: 50px;
          box-sizing: content-box;
          position: absolute;
          width: 100px;
          top: ${20 + i * 50}px;
        `"
      ></div>
    </div>
    <div
      style="width: calc(100% - 100px); position: relative; overflow: hidden"
    >
      <Cursor />
      <TimeView />
      <div style="display: flex; position: relative">
        <div
          v-for="(layer, i) in layers"
          :key="i"
          :strips="layer"
          class="layer"
          :style="`top: ${i * 50}px`"
        />
        <PanelsStripUI v-for="(strip, i) in strips" :key="i" :strip="strip" />
      </div>
      <ScaleScroll
        style="position: absolute; bottom: 0"
        :start="timeline.start / timeline.length"
        :end="timeline.end / timeline.length"
        @start="(n) => changeView(n * timeline.length, timeline.end)"
        @end="(n) => changeView(timeline.start, n * timeline.length)"
      />
    </div>
  </div>
</template>

<style scoped>
.timeline-root {
  display: flex;
  overflow: hidden;
  height: calc(100% - 12px);
  position: relative;
}
.layer {
  display: flex;
  width: 100%;
  position: absolute;
  height: 50px;
  border-bottom: 1px solid var(--grey-500);
  box-sizing: content-box;
}
</style>
