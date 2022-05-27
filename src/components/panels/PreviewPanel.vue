<script setup lang="ts">
import * as THREE from 'three'
import { view } from '~~/src/composables/useTimeline'
import { timeFormat } from '~~/src/utils/formatTime'

const canvas = ref<HTMLCanvasElement | null>(null)

const el = ref<HTMLDivElement | null>(null)

const { addUpdate } = useUpdate()
const { timeline, selectStrip } = useTimeline()

const scale = ref(0.2)

onMounted(() => {
  if (!canvas.value) { return }
  if (!el.value) { return }
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas.value
  })
  const width = timeline.value.width
  const height = timeline.value.height
  renderer.setSize(width, height)

  if (view.camera.left === 0) {
    view.camera.left = -width / 2
    view.camera.right = width / 2
    view.camera.top = height / 2
    view.camera.bottom = -height / 2
    view.camera.near = -100
    view.camera.far = 1000
  }

  addUpdate(() => {
    if (!canvas.value) { return }
    // const rect = el.value?.getBoundingClientRect();
    renderer.setSize(width, height)
    canvas.value.style.margin = 'auto'

    canvas.value.style.width = `${width * scale.value}px`
    canvas.value.style.height = ''
    view.camera.updateProjectionMatrix()

    renderer.render(view.scene, view.camera)
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
      if (alreadySelected) { continue }

      // TODO 矩形を計算して選択する
      selectStrip([strip.id])
      break
    }
  }
}
</script>

<template>
  <div
    ref="el"
    style="height: calc(100% - 12px); width: 100%; overflow: hidden"
  >
    <div class="flex h-24 whitespace-nowrap">
      <div>Zoom :</div>
      <v-input
        :value="scale"
        :scale="0.01"
        :step="0.01"
        :min="0.1"
        :max="1"
        :view="(n) => n.toFixed(2)"
        @input="(n) => (scale = n)"
      />
    </div>
    <div style="display: flex; height: calc(100% - 24px - 12px - 4px)">
      <div class="m-auto relative">
        <preview-gizmo :scale="scale" />
        <canvas
          ref="canvas"
          style="width: 100%; height: 100%; margin: auto"
          @pointerdown="pointerdown"
        />
      </div>
    </div>
    <div style="line-height: 12px; height: 12px">
      {{ timestamp }}
    </div>
  </div>
</template>
