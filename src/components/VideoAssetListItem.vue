<script setup lang="ts">
import { IAsset } from '../core/IAsset'

defineProps<{ asset: IAsset }>()

const videoEl = ref<HTMLVideoElement | null>(null)

onMounted(() => {
  if (!videoEl.value) {
    return
  }
  videoEl.value.currentTime = 2
})
</script>

<template>
  <div style="padding: 4px">
    <div style="display: flex; width: 32px">
      <!-- <video ref="videoEl" class="video m-auto" :src="asset.path" /> -->
    </div>
  </div>
  <div style="margin: auto 0">
    {{ asset.name }}
  </div>
</template>

<style scoped>
.video {
  min-height: 24px;
  max-height: 24px;
  max-width: 32px;
}
</style>
