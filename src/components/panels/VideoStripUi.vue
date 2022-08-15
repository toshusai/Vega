<script setup lang="ts">
import { audioCtx, waitForFirstInterfact } from '~~/src/core/Global'
import { Strip } from '~~/src/core/Strip'
import { VideoStripEffect } from '~~/src/core/VideoStripEffect'
import { VideoStripEffectObject } from '~~/src/core/VideoStripEffectObject'
import { getCache, setCache, drawCtx, drawCanvas, getThumbnailVideo } from '~~/src/utils/thumbnailCache'

const props = defineProps<{ strip: Strip }>()
const { timeline } = useTimeline()
const { assets } = useAssets()

const imageEls = ref<HTMLImageElement[]>([])

const videoArray = ref<number[]>([])

const videoEffect = computed(
  () => props.strip.effects.find(e => e.type === 'Video') as VideoStripEffect
)

const videoSrc = computed(() => {
  return (
    assets.value.assets.find((a) => {
      return a.id === videoEffect.value.videoAssetId
    })?.path || ''
  )
})
const el = ref<HTMLElement | null>(null)

const pixScale = computed(() => {
  // const width =
  //   el.value?.parentElement?.parentElement?.getBoundingClientRect().width || 1
  // const viewScale =
  //   (timeline.value.end - timeline.value.start) / timeline.value.length
  // return width / timeline.value.scale / viewScale

  return usePixPerSecTimeline(el.value?.parentElement?.parentElement)
})

const effectObj = computed(() => {
  const effectObj = effectObjectMap.get(
    videoEffect.value.id
  ) as VideoStripEffectObject | null
  return effectObj
})

const videoWidth = ref(0)

function updateVideoArray () {
  if (!el.value) {
    return
  }
  const parentRect = el.value.getBoundingClientRect()
  if (!effectObj.value) {
    return
  }
  if (effectObj.value.video.videoHeight === 0) {
    return
  }
  const ratio =
    effectObj.value.video.videoHeight / effectObj.value.video.videoWidth

  videoWidth.value = videoHeight / ratio

  const newArray = Array(Math.ceil(parentRect.width / videoWidth.value) + 1).map(
    (_, i) => i
  )

  if (newArray.length !== videoArray.value.length) {
    videoArray.value = newArray
  }
}

const videoHeight = 40
const thumbnailVideo = getThumbnailVideo(props.strip.id)
onMounted(() => {
  ctx.value = canvas.value?.getContext('2d') || null

  if (!effectObj.value) {
    return
  }
  effectObj.value.video.addEventListener('loadedmetadata', () => {
    thumbnailVideo.src = videoSrc.value
    updateVideoArray()
    getBuffer(true)
  })
})

const rootOffset = ref(0)
let cansels: (() => void)[] = []
const updateVideoStart = async () => {
  if (!el.value) {
    return
  }
  if (!canvas.value) {
    return
  }
  const rect = el.value.getBoundingClientRect()
  const promises: (() => Promise<void>)[] = []

  for (let i = 0; i < cansels.length; i++) {
    const c = cansels[i]
    c()
  }
  cansels = []

  let i = 0
  canvas.value.width = rect.width + 50
  imageEls.value.forEach((imageEl) => {
    if (!imageEl) {
      return
    }
    if (!thumbnailVideo) {
      return
    }
    const rect = imageEl.getBoundingClientRect()
    const startPx = 8 + videoWidth.value * i // rect.left - parentRect.left;

    promises.push(
      () =>
        new Promise<void>((resolve) => {
          cansels.push(() => resolve())
          const i = setTimeout(() => {
            clearTimeout(i)
            resolve()
          }, 1000)
          let currentTime = 0

          if (!thumbnailVideo) {
            return resolve()
          }
          thumbnailVideo.onseeked = () => {
            const cache = getCache(currentTime)
            if (cache) {
              imageEl.src = cache
              resolve()
              return
            }
            if (!thumbnailVideo) {
              return resolve()
            }
            if (!imageEl) {
              return resolve()
            }
            if (!drawCanvas) {
              return resolve()
            }
            drawCanvas.width = videoWidth.value
            drawCanvas.height = videoHeight
            drawCtx?.drawImage(
              thumbnailVideo,
              0,
              0,
              drawCanvas.width,
              drawCanvas.height
            )
            const url = drawCanvas?.toDataURL('image/jpeg', 0.5)

            if (url) {
              setCache(currentTime, url)
              imageEl.src = url
            }
            resolve()
          }

          currentTime = startPx / pixScale.value + videoEffect.value.start
          const left =
            (props.strip.start - timeline.value.start) * pixScale.value

          if (left < -50) {
            rootOffset.value = (left + 50) % videoWidth.value
            const l = Math.floor((left + 50) / rect.width) + 1
            const delta = (l * videoWidth.value) / pixScale.value
            currentTime -= delta
          } else {
            rootOffset.value = 0
          }

          const cache = getCache(currentTime)
          if (cache) {
            imageEl.src = cache
            resolve()
          } else {
            thumbnailVideo.currentTime = currentTime
          }
        })
    )
    i++
  })

  for (let i = 0; i < promises.length; i++) {
    const element = promises[i]
    await element()
  }
  getBuffer()
}

const audioBuffer = ref<AudioBuffer | null>(null)
const loading = ref(false)
function getBuffer (force = false) {
  if (audioBuffer.value && !force) {
    draw()
    return
  }
  if (loading.value) {
    return
  }
  loading.value = true
  fetch(videoSrc.value)
    .then(response => response.arrayBuffer())
    .then(async (arrayBuffer) => {
      await waitForFirstInterfact()
      if (!audioCtx) {
        return
      }
      if (!drawCtx) {
        return
      }
      const rect = el.value?.parentElement?.getBoundingClientRect()
      if (!rect) {
        return
      }
      try {
        // Ref: https://css-tricks.com/making-an-audio-waveform-visualizer-with-vanilla-javascript/
        audioBuffer.value = await audioCtx.decodeAudioData(arrayBuffer)
        loading.value = false
        draw()
      } catch (e) { }
    })
}

const canvas = ref<HTMLCanvasElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)
const overLeft = computed(() => {
  return (props.strip.start - timeline.value.start) * pixScale.value
})
function draw () {
  // console.log("ok");
  if (!ctx.value) {
    return
  }
  const rect = canvas.value?.parentElement?.getBoundingClientRect()
  const elrect = el.value?.parentElement?.getBoundingClientRect()
  if (!rect) {
    return
  }
  if (!elrect) {
    return
  }
  if (!audioBuffer.value) {
    return
  }
  const lengthPerSec = audioBuffer.value.sampleRate
  const data = audioBuffer.value.getChannelData(0)

  // console.log("ok");

  // 表示されている時間
  const visualTime = (elrect.width) / pixScale.value
  // 表示されているデータ配列の数
  const visualData = Math.floor(visualTime * lengthPerSec)
  // １ピクセルあたりのデータ数
  const dataPerPixel = Math.floor(visualData / elrect.width) * 1
  // console.log(visualTime, visualData, dataPerPixel);

  const sumData = []
  let sum = 0
  let pixel = 0

  let max = 0
  let min = 0

  let start = Math.floor(videoEffect.value.start * lengthPerSec)

  if (overLeft.value < -50) {
    // const l = Math.floor((overLeft.value + 50) / videoWidth.value) + 1
    start = Math.floor(dataPerPixel * (-50 - overLeft.value))
    // console.log(start);
  }

  function clamp (v: number, min: number, max: number) {
    return Math.max(min, Math.min(max, v))
  }
  for (let i = start; i < visualData + start + 100; i++) {
    sum += Math.abs(clamp(data[i], -1, 1))
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
  // ctx.value.fillStyle = "#fff2";
  // ctx.value.fillRect(0, 0, rect.width, rect.height);
  ctx.value.fillStyle = 'darkorange'

  const canvasRect = canvas.value?.getBoundingClientRect()
  if (!canvasRect) {
    return
  }
  // const leftOffset = Math.floor(canvasRect.left - rect.left);

  const scale = 1
  for (let i = 0; i < sumData.length; i++) {
    // ハンドルの分ずらす
    const height = sumData[i + 12] * 40 * scale

    ctx.value.fillRect(i, 40 - height * 2 * videoEffect.value.volume, 1, 40)
  }
}

watch(imageEls.value, () => updateVideoStart())
watch(props.strip, () => {
  updateVideoArray()
  updateVideoStart()
})
watch(timeline.value, () => {
  updateVideoArray()
  updateVideoStart()
})
</script>

<template>
  <div
    v-if="videoEffect"
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
    <div :style="`left: ${rootOffset + 4}px`" style="display: flex; pointer-events: none; position: absolute;">
      <img
        v-for="(_, i) in videoArray"
        :key="i"
        :ref="
          (el) => {
            imageEls[i] = el as HTMLImageElement;
          }
        "
        :width="videoWidth"
        :height="videoHeight"
        class="video"
      >
    </div>
    <div
      :style="`margin-left: ${0 + 4
      }px; display: flex; pointer-events: none;`"
    >
      <canvas ref="canvas" class="canvas" height="40" />
    </div>
  </div>
</template>

<style scoped>
.canvas {
  position: absolute;
  display: flex;
  pointer-events: none;
}

.video {
  height: 100%;
  max-width: none;
  pointer-events: none;
}
</style>
