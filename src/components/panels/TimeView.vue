<script setup lang="ts">
const { timeline, update } = useTimeline();

const el = ref<HTMLElement>(null);

const pixScale = computed(() => {
  const width = el.value?.parentElement.getBoundingClientRect().width || 1;
  const viewScale =
    (timeline.value.end - timeline.value.start) / timeline.value.length;
  return width / timeline.value.scale / viewScale;
});

const secs = computed(() => {
  const times = [];

  for (let i = Math.round(timeline.value.start); i < timeline.value.end; i++) {
    times.push({
      time: i,
      left: (i - timeline.value.start) * pixScale.value,
    });
  }
  return times;
});

function setTime(e: MouseEvent) {
  const x = e.clientX;
  const width = el.value?.parentElement.getBoundingClientRect().width || 1;
  const time = x / pixScale.value + timeline.value.start;
  update(time, true);
}
</script>

<template>
  <div
    ref="el"
    class="view"
    style="
      height: 10px;
      font-size: 4px;
      line-height: 10px;
      border-bottom: 1px solid black;
      position: relative;
      overflow: hidden;
    "
    @click="setTime"
  >
    <div
      v-for="(sec, i) in secs"
      :key="i"
      class="sec"
      style="border-left: 1px solid black"
      :style="{ position: 'absolute', left: sec.left + 'px' }"
    >
      {{ sec.time }}
    </div>
  </div>
</template>

<style scoped>
.view {
  cursor: pointer;
  user-select: none;
}
</style>
