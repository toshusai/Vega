<script setup lang="ts">
import * as THREE from "three";
import { view } from "~~/src/composables/useTimeline";
import Gizmo from "../Gizmo.vue";

const canvas = ref<HTMLCanvasElement>(null);

const el = ref<HTMLDivElement>(null);

const { addUpdate } = useUpdate();
const { timeline } = useTimeline();

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
    const rect = el.value.getBoundingClientRect();
    renderer.setSize(width, height);
    canvas.value.style.margin = `auto`;

    canvas.value.style.width = `${width * scale.value}px`;
    canvas.value.style.height = ``;
    view.camera.updateProjectionMatrix();

    renderer.render(view.scene, view.camera);
  });
});
</script>

<template>
  <div
    ref="el"
    style="height: calc(100% - 12px); width: 100%; overflow: hidden"
  >
    <div class="flex h-24">
      <div>Zoom:</div>
      <v-select
        :value="scale"
        @input="(v) => Number.parseFloat((scale = v.target.value))"
      >
        <option value="1">100%</option>
        <option value="0.5">50%</option>
        <option value="0.2">20%</option>
      </v-select>
    </div>
    <div style="display: flex; height: calc(100% - 16px)">
      <div class="m-auto relative">
        <gizmo :scale="scale"></gizmo>
        <canvas ref="canvas" style="width: 100%; height: 100%; margin: auto" />
      </div>
    </div>
  </div>
</template>
