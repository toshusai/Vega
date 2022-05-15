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
  // view.scene = new THREE.Scene();
  renderer.setSize(width, height);
  // view.camera.top = height / 2;
  // view.camera.bottom = -height / 2;
  // view.camera.left = -width / 2;
  // view.camera.right = width / 2;
  // view.camera.updateProjectionMatrix();
  if (view.camera.left == 0) {
    view.camera.left = -width / 2;
    view.camera.right = width / 2;
    view.camera.top = height / 2;
    view.camera.bottom = -height / 2;
    view.camera.near = -100;
    view.camera.far = 1000;
  }
  console.log(view.camera.left);

  // view.camera = new THREE.OrthographicCamera(
  //   -width / 2,
  //   width / 2,
  //   height / 2,
  //   -height / 2,
  //   -100,
  //   1000
  // );

  // view.camera = new THREE.PerspectiveCamera(
  //   75,
  //   window.innerWidth / window.innerHeight,
  //   0.1,
  //   1000
  // );

  // view.camera.position.z = -10;
  // view.camera.near = 0.1;
  // view.camera.far = 100;
  // view.scene.add(view.camera);

  // const cube = new THREE.Mesh(
  //   new THREE.BoxGeometry(1, 1, 1),
  //   new THREE.MeshBasicMaterial({
  //     color: 0xffffff,
  //   })
  // );
  // cube.scale.set(100, 100, 100);
  // view.camera.position.z = 5;
  // view.scene.add(cube);
  // console.log(cube, view.camera);

  {
    // const scene = new THREE.Scene();
    // const camera = new THREE.PerspectiveCamera(
    //   75,
    //   window.innerWidth / window.innerHeight,
    //   0.1,
    //   1000
    // );
    // const renderer = new THREE.WebGLRenderer();
    // renderer.setSize(window.innerWidth, window.innerHeight);
    // document.body.appendChild(renderer.domElement);
    // const geometry = new THREE.BoxGeometry();
    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // const cube = new THREE.Mesh(geometry, material);
    // scene.add(cube);
    // camera.position.z = 5;
    // function animate() {
    //   requestAnimationFrame(animate);
    //   cube.rotation.x += 0.01;
    //   cube.rotation.y += 0.01;
    //   renderer.render(scene, camera);
    // }
    // animate();
  }

  addUpdate(() => {
    if (!canvas.value) return;
    const rect = el.value.getBoundingClientRect();
    renderer.setSize(width, height);
    // cube.rotateX(0.01);
    // cube.rotateY(0.01);
    // cube.rotateZ(0.01);
    canvas.value.style.margin = `auto`;

    canvas.value.style.width = `${width * scale.value}px`;
    canvas.value.style.height = ``;
    // canvas.value.style.width = ``;
    // canvas.value.style.height = rect.height + `px`;

    // const rate = width / height;
    // const elRate = rect.width / rect.height;
    // if (rate < elRate) {
    //   canvas.value.style.width = ``;
    //   canvas.value.style.height = rect.height + `px`;
    // } else {
    //   canvas.value.style.width = rect.width + `px`;
    //   canvas.value.style.height = ``;
    // }
    // view.camera.updateMatrix();
    view.camera.updateProjectionMatrix();
    // console.log("render");

    renderer.render(view.scene, view.camera);
    // console.log(view.scene.children);

    // console.log(view.camera);
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
      <v-select :value="scale" @input="(v) => (scale = v.target.value)">
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
