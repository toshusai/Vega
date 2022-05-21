<script setup lang="ts">
import { Strip } from "~~/src/core/Strip";
import { TextStripEffect } from "~~/src/core/TextStripEffect";
import { TextStripEffectObject } from "~~/src/core/TextStripEffectObject";

const props = defineProps<{ strip: Strip }>();
const { timeline } = useTimeline();

const textEffect = computed(() => {
  return props.strip.effects.find((e) => e.type === "Text") as TextStripEffect;
});

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
    textEffect.value.id
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

const overLeft = computed(() => {
  return (props.strip.start - timeline.value.start) * pixScale.value;
});

const markerSize = 12;

// const animations = ref(textEffect.animations);
// const updateFlag = ref(false);
// watch(
//   () => [...props.strip.effects],
//   () => {
//     console.log("update", textEffect.animations.length);

//     animations.value = textEffect.animations;
//   }
// );
</script>

<template>
  <div
    v-if="textEffect"
    ref="el"
    style="height: 100%; display: flex; overflow: hidden; padding: 0 12px"
    class="relative"
  >
    <div style="overflow: hidden">
      <canvas
        ref="canvas"
        class="video absolute"
        :style="{
          left:
            (overLeft < 0 ? (overLeft < -50 ? 62 : 12 - overLeft) : 12) + 'px',
        }"
      />
      <!-- {{ animations.length }} -->
    </div>
    <div>
      <svg
        v-for="(anim, i) in textEffect.animations"
        :key="i"
        class="absolute"
        style="fill: orange; stroke: white; stroke-width: 2px"
        :style="`width: ${markerSize}px; height: ${markerSize}px; left: ${
          anim.time * pixScale -
          4 -
          markerSize / 2 +
          (overLeft < -50 ? overLeft + 50 : 0) // 4(strip border) + 6(half width)
        }px; z-index: 10; bottom: ${0}px`"
        viewBox="0 0 24 24"
      >
        <path
          d="M12 2C11.5 2 11 2.19 10.59 2.59L2.59 10.59C1.8 11.37 1.8 12.63 2.59 13.41L10.59 21.41C11.37 22.2 12.63 22.2 13.41 21.41L21.41 13.41C22.2 12.63 22.2 11.37 21.41 10.59L13.41 2.59C13 2.19 12.5 2 12 2Z"
        />
      </svg>
    </div>
  </div>
</template>

<style scoped>
.video {
  height: 100%;
  pointer-events: none;
}
</style>
