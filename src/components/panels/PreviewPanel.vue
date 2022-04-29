<script setup lang="ts">
import * as THREE from "three";

const canvas = ref<HTMLCanvasElement>(null);
onMounted(() => {
  if (!canvas.value) return;
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas.value,
  });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    canvas.value.width / canvas.value.height,
    0.1,
    1000
  );
  camera.position.z = 5;
  scene.add(camera);
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
  });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  const update = () => {
    requestAnimationFrame(update);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  };
  update();
});
</script>

<template>
  <div style="display: flex; height: 100%; width: 100%">
    <canvas ref="canvas" style="margin: auto" />
  </div>
</template>
