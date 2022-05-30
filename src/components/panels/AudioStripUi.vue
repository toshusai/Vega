<script setup lang="ts">
import { Strip } from '~~/src/core/Strip'
import { VideoStripEffectObject } from '~~/src/core/VideoStripEffectObject'
import { AudioStripEffect } from '~~/src/core/AudioStripEffect'
import { audioCtx, waitForFirstInterfact } from '~/core/Global'

const props = defineProps<{ strip: Strip }>()
const { timeline } = useTimeline()
const { assets } = useAssets()

const imageEls = ref<HTMLImageElement[]>([])

const audioEffect = computed(() => props.strip.effects.find(
  e => e.type === 'Audio'
) as AudioStripEffect)

const audioSrc = computed(() => {
  return (
    assets.value.assets.find((a) => {
      return a.id === audioEffect.value.audioAssetId
    })?.path || ''
  )
})
const el = ref<HTMLElement | null>(null)

const pixScale = computed(() => {
  const width =
    el.value?.parentElement?.parentElement?.getBoundingClientRect().width || 1
  const viewScale =
    (timeline.value.end - timeline.value.start) / timeline.value.length
  return width / timeline.value.scale / viewScale
})

const effectObj = computed(() => {
  const effectObj = effectObjectMap.get(
    audioEffect.value.id
  ) as VideoStripEffectObject | null
  return effectObj
})

const videoHeight = 40

const canvas = ref<HTMLCanvasElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)

let audioBuffer: AudioBuffer | null = null

const overLeft = computed(() => {
  return (props.strip.start - timeline.value.start) * pixScale.value
})

function draw () {
  if (!ctx.value) { return }
  const rect = canvas.value?.parentElement?.getBoundingClientRect()
  const elrect = el.value?.parentElement?.getBoundingClientRect()
  if (!rect) { return }
  if (!elrect) { return }
  if (!audioBuffer) { return }
  const lengthPerSec = audioBuffer.sampleRate
  const data = audioBuffer.getChannelData(0)

  // 表示されている時間
  const visualTime = elrect.width / pixScale.value
  // 表示されているデータ配列の数
  const visualData = Math.floor(visualTime * lengthPerSec)
  // １ピクセルあたりのデータ数
  const dataPerPixel = Math.floor(visualData / elrect.width)

  const sumData = []
  let sum = 0
  let pixel = 0

  let max = 0
  let min = 0

  let start = Math.floor(audioEffect.value.start * lengthPerSec)

  if (overLeft.value < -50) {
    start = Math.floor(dataPerPixel * (-50 - overLeft.value))
  }

  for (let i = start; i < visualData + start; i++) {
    sum += Math.abs(data[i])
    pixel++
    if (pixel >= dataPerPixel) {
      const v = sum / dataPerPixel
      sumData.push(v)
      max = Math.max(max, v)
      min = Math.min(min, v)
      sum = 0
      pixel = 0
    }
  }

  ctx.value.clearRect(0, 0, rect.width, rect.height)
  ctx.value.fillStyle = '#fff2'
  ctx.value.fillRect(0, 0, rect.width, rect.height)
  ctx.value.fillStyle = 'orange'

  const canvasRect = canvas.value?.getBoundingClientRect()
  if (!canvasRect) { return }
  // const leftOffset = Math.floor(canvasRect.left - rect.left);

  for (let i = 0; i < sumData.length; i++) {
    // ハンドルの分ずらす
    const height = sumData[i + 12] * 40

    ctx.value.fillRect(i, 40 - height * 2 * audioEffect.value.volume, 1, 40)
  }
}

let load = false
function getBuffer () {
  if (audioBuffer) {
    draw()
    return
  }
  if (load) { return }
  load = true
  fetch(audioSrc.value)
    .then(response => response.arrayBuffer())
    .then(async (arrayBuffer) => {
      await waitForFirstInterfact()
      if (!audioCtx) { return }
      if (!ctx.value) { return }
      const rect = el.value?.parentElement?.getBoundingClientRect()
      if (!rect) { return }
      // Ref: https://css-tricks.com/making-an-audio-waveform-visualizer-with-vanilla-javascript/
      audioCtx.decodeAudioData(arrayBuffer).then((_audioBuffer) => {
        audioBuffer = _audioBuffer
        draw()
      })
    })
}

onMounted(() => {
  if (!effectObj.value) { return }
  if (!canvas.value) { return }
  ctx.value = canvas.value.getContext('2d')
  updateVideoStart()
})

const rootOffset = ref(0)
const updateVideoStart = () => {
  if (!el.value) { return }
  const rect = el.value.getBoundingClientRect()
  if (!rect) { return }
  if (!canvas.value) { return }
  canvas.value.width = rect.width
  getBuffer()
}

watch(imageEls.value, () => updateVideoStart())
watch(props.strip, () => {
  updateVideoStart()
})
watch(timeline.value, () => {
  updateVideoStart()
})
</script>

<template>
  <div
    v-if="audioEffect"
    ref="el"
    style="
      height: 100%;
      display: flex;
      overflow: hidden;
      padding: 0 4px;
      position: absolute;
      width: 100%;
    "
  >
    <div
      :style="`margin-left: ${rootOffset + 4}px`"
      class="flex pointer-events-none"
    >
      <canvas ref="canvas" :height="videoHeight" class="video" />
    </div>
  </div>
</template>

<style scoped>
.video {
  height: 100%;
  max-width: none;
  pointer-events: none;
}
</style>
