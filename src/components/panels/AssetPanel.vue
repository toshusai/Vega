<script setup lang="ts">
let fileHandle;
async function getFile() {
  // open file picker

  if (fileHandle.kind === "file") {
    // run file code
  } else if (fileHandle.kind === "directory") {
    // run directory code
  }
  console.log(fileHandle);
}

interface IAsset {
  id: string;
  path: string;
  name: string;
  type: string;
}

const assets: IAsset[] = [
  { id: "1", path: "/BigBuckBunny.mp4", name: "Big Buck Bunny", type: "Video" },
];
</script>
<template>
  <div v-for="(asset, i) in assets" :key="i">
    {{ asset.name }}
  </div>
</template>
