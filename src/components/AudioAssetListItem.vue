<script setup lang="ts">
import { IAsset } from "../core/IAsset";

const props = defineProps<{ asset: IAsset }>();

const videoEl = ref<HTMLVideoElement | null>(null);

onMounted(() => {
  if (!videoEl.value) return;
  videoEl.value.currentTime = 20;
});
</script>

<template>
  <div style="padding: 4px">
    <div style="width: 32px"></div>
  </div>
  <div style="margin: auto 0">
    {{ asset.name }}
  </div>
</template>

<style scoped></style>
