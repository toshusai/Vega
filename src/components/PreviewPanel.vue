<script setup lang="ts">
import * as THREE from 'three'
import { Renderer } from '@/core/Renderer'
import { Recorder } from '@/core/Recorder'
import { timeFormat } from '@/utils/formatTime'

const canvas = ref<HTMLCanvasElement | null>(null)

const el = ref<HTMLDivElement | null>(null)

const { addUpdate } = useUpdate()
const { timeline, selectStrip } = useTimeline()

const scale = ref(0.2)

const recorder = ref<Recorder | null>(null)

onMounted(() => {
  if (!canvas.value) {
    return
  }
  if (!el.value) {
    return
  }
  recorder.value = new Recorder(canvas.value)
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas.value
  })
  const width = timeline.value.width
  const height = timeline.value.height
  renderer.setSize(width, height)

  if (Renderer.camera.left === 0) {
    Renderer.camera.left = -width / 2
    Renderer.camera.right = width / 2
    Renderer.camera.top = height / 2
    Renderer.camera.bottom = -height / 2
    Renderer.camera.near = -100
    Renderer.camera.far = 1000
  }

  addUpdate(() => {
    if (!canvas.value) {
      return
    }
    // const rect = el.value?.getBoundingClientRect();
    renderer.setSize(width, height)
    canvas.value.style.margin = 'auto'

    canvas.value.style.width = `${width * scale.value}px`
    canvas.value.style.height = ''
    Renderer.camera.updateProjectionMatrix()

    renderer.render(Renderer.scene, Renderer.camera)
    if (timeline.value.isRecording) {
      if (timeline.value.curent > timeline.value.length) {
        recorder.value?.stop()
      }
    }
  })
})

const timestamp = computed(() => timeFormat(timeline.value.curent))

/**
 * クリックで選択可能なStripを選択
 * @param e
 */
function pointerdown () {
  // const { left, top } = canvas.value?.getBoundingClientRect() || {
  //   left: 0,
  //   right: 0,
  //   top: 0,
  //   bottom: 0,
  // };

  // const x = (e.clientX - left) / scale.value;
  // const y = (e.clientY - top) / scale.value;

  for (const strip of timeline.value.strips) {
    if (
      strip.start < timeline.value.curent &&
      strip.start + strip.length > timeline.value.curent
    ) {
      const alreadySelected = timeline.value.selectedStrips.find((s) => {
        return s.id === strip.id
      })
      if (alreadySelected) {
        continue
      }

      // TODO 矩形を計算して選択する
      selectStrip([strip.id])
      break
    }
  }
}
</script>

<template>
  <div ref="el" style="height: 100%; width: 100%; overflow: hidden">
    <div style="display: flex; height: calc(100% - 24px); overflow: hidden">
      <div style="margin: auto; position: relative">
        <preview-gizmo :scale="scale" />
        <canvas
          ref="canvas"
          style="width: 100%; height: 100%; margin: auto"
          @pointerdown="pointerdown"
        />
      </div>
    </div>
    <div style="line-height: 12px; height: 24px; text-align: center; display: flex; border-top: 1px solid white;">
      <div style="display: flex; white-space: nowrap; margin: auto">
        <v-input
          style="height: 16px"
          :value="scale"
          :scale="0.01"
          :step="0.01"
          :min="0.1"
          :max="1"
          :view="n => n.toFixed(2)"
          @input="n => (scale = n)"
        />
      </div>

      <div style="margin: auto">
        {{ timestamp }}
      </div>
    </div>
  </div>
</template>
