<script setup lang="ts">
import { Strip } from "~~/src/core/Strip";
import { TextStripEffect } from "~~/src/core/TextStripEffect";
import { TextStripEffectObject } from "~~/src/core/TextStripEffectObject";

const props = defineProps<{ strip: Strip }>();
const { timeline } = useTimeline();

const textEffect = props.strip.effects.find(
  (e) => e.type === "Text"
) as TextStripEffect;

const videoSrc = "./BigBuckBunny.mp4";

const el = ref<HTMLElement | null>(null);

const pixScale = computed(() => {
  const width =
    el.value?.parentElement?.parentElement?.getBoundingClientRect().width || 1;
  const viewScale =
    (timeline.value.end - timeline.value.start) / timeline.value.length;
  return width / timeline.value.scale / viewScale;
});

const canvas = ref<HTMLCanvasElement | null>(null);

const effectObj = computed(() => {
  const effectObj = effectObjectMap.get(
    textEffect.id
  ) as TextStripEffectObject | null;
  return effectObj;
});

function drawCanvas() {
  if (!canvas.value) return;
  const ctx = canvas.value?.getContext("2d");
  if (!ctx) return;
  if (!effectObj.value) return;
  const srcCanvas = effectObj.value.canvas;
  const srcCtx = srcCanvas.getContext("2d");
  // canvas.value.width = srcCanvas.width;
  // canvas.value.height = srcCanvas.height;
  if (!srcCtx) return;
  const mw = effectObj.value.mesureWidth;
  const mh = effectObj.value.mesureHeight;
  const rate = mw / mh;

  canvas.value.width = canvas.value.height * rate;
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

  ctx.drawImage(
    srcCtx.canvas,
    srcCanvas.width / 2 - mw / 2,
    srcCtx.canvas.height / 2 - mh / 2,
    mw,
    mh,
    0,
    0,
    canvas.value.width,
    canvas.value.height
  );
}

onMounted(() => {
  const update = () => {
    drawCanvas();
    window.requestAnimationFrame(update);
  };
  update();
});
</script>

<template>
  <div
    v-if="textEffect"
    ref="el"
    style="height: 100%; display: flex; overflow: hidden; padding: 0 12px"
  >
    <div style="overflow: hidden">
      <canvas ref="canvas" class="video" />
    </div>
  </div>
</template>

<style scoped>
.video {
  height: 100%;
  pointer-events: none;
}
</style>
