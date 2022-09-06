<script setup lang="ts">
import { mdiRhombus } from '@mdi/js'
import { Strip, TextStripEffect, TextStripEffectObject, Renderer } from '@/core'

const props = defineProps<{ strip: Strip }>()
const { timeline } = useTimeline()

const textEffect = computed(() => {
  return props.strip.effects.find(e => e.type === 'Text') as TextStripEffect
})

const el = ref<HTMLElement | null>(null)

const pixScale = computed(() => {
  const width =
    el.value?.parentElement?.parentElement?.getBoundingClientRect().width || 1
  const viewScale =
    (timeline.value.end - timeline.value.start) / timeline.value.length
  return width / timeline.value.length / viewScale
})

const canvas = ref<HTMLCanvasElement | null>(null)

const effectObj = computed(() => {
  const effectObj = Renderer.effectObjectMap.get(
    textEffect.value.id
  ) as TextStripEffectObject | null
  return effectObj
})

function drawCanvas () {
  if (!canvas.value) {
    return
  }
  const ctx = canvas.value?.getContext('2d')
  if (!ctx) {
    return
  }
  if (!effectObj.value) {
    return
  }
  const srcCanvas = effectObj.value.canvas
  const srcCtx = srcCanvas.getContext('2d')
  // canvas.value.width = srcCanvas.width;
  // canvas.value.height = srcCanvas.height;
  if (!srcCtx) {
    return
  }
  const mw = effectObj.value.mesureWidth
  const mh = effectObj.value.mesureHeight
  const rate = mw / mh

  canvas.value.width = canvas.value.height * rate
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)

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
  )
}

onMounted(() => {
  const update = () => {
    drawCanvas()
    window.requestAnimationFrame(update)
  }
  update()
})

const overLeft = computed(() => {
  return (props.strip.start - timeline.value.start) * pixScale.value
})

const markerSize = 12

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
    style="
      height: 100%;
      display: flex;
      overflow: hidden;
      padding: 0 12px;
      position: relative;
    "
  >
    <div style="overflow: hidden">
      <canvas
        ref="canvas"
        class="video"
        :style="{
          left:
            (overLeft < 0 ? (overLeft < -50 ? 62 : 12 - overLeft) : 12) + 'px'
        }"
      />
      <!-- {{ animations.length }} -->
    </div>
    <div>
      <v-icons
        v-for="(anim, i) in textEffect.animations"
        :key="i"
        :path="mdiRhombus"
        style="
          fill: orange;
          stroke: white;
          stroke-width: 2px;
          position: absolute;
        "
        :style="`width: ${markerSize}px; height: ${markerSize}px; left: ${
          anim.time * pixScale -
          4 -
          markerSize / 2 +
          (overLeft < -50 ? overLeft + 50 : 0) // 4(strip border) + 6(half width)
        }px; z-index: 1; bottom: ${0}px`"
        viewBox="0 0 24 24"
      />
    </div>
  </div>
</template>

<style scoped>
.video {
  max-height: 100%;
  max-width: 100%;
  pointer-events: none;
  position: absolute;
}
</style>
