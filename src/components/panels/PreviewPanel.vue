<script setup lang="ts">
import { time } from "console";
import * as THREE from "three";
import { view } from "~~/src/composables/useTimeline";
import { eventToFloat } from "~~/src/utils/eventToFloat";
import { timeFormat } from "~~/src/utils/formatTime";

const canvas = ref<HTMLCanvasElement | null>(null);

const el = ref<HTMLDivElement | null>(null);

const { addUpdate } = useUpdate();
const { timeline, selectStrip } = useTimeline();

const scale = ref(0.2);

onMounted(() => {
  if (!canvas.value) return;
  if (!el.value) return;
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas.value,
  });
  const width = timeline.value.width;
  const height = timeline.value.height;
  renderer.setSize(width, height);

  if (view.camera.left == 0) {
    view.camera.left = -width / 2;
    view.camera.right = width / 2;
    view.camera.top = height / 2;
    view.camera.bottom = -height / 2;
    view.camera.near = -100;
    view.camera.far = 1000;
  }

  addUpdate(() => {
    if (!canvas.value) return;
    // const rect = el.value?.getBoundingClientRect();
    renderer.setSize(width, height);
    canvas.value.style.margin = `auto`;

    canvas.value.style.width = `${width * scale.value}px`;
    canvas.value.style.height = ``;
    view.camera.updateProjectionMatrix();

    renderer.render(view.scene, view.camera);
  });
});

const timestamp = computed(() => timeFormat(timeline.value.curent));

function pointerdown(e: MouseEvent) {
  const { left, right, top, bottom } =
    canvas.value?.getBoundingClientRect() || {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    };
  const x = (e.clientX - left) / scale.value;
  const y = (e.clientY - top) / scale.value;

  timeline.value.strips.forEach((strip) => {
    if (
      strip.start < timeline.value.curent &&
      strip.start + strip.length > timeline.value.curent
    ) {
      selectStrip([strip.id]);
    }
  });
}
</script>

<template>
  <div
    ref="el"
    style="height: calc(100% - 12px); width: 100%; overflow: hidden"
  >
    <div class="flex h-24">
      <div>Zoom:{{ scale }}</div>
      <v-select :value="scale" @input="(e) => (scale = eventToFloat(e))">
        <option value="1">100%</option>
        <option value="0.5">50%</option>
        <option value="0.2">20%</option>
      </v-select>
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
