<script setup lang="ts">
import { mdiFileVideo } from '@mdi/js'
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
  <div style="display: flex; min-width: 32px">
    <v-icons style="margin: auto" fill="white" :path="mdiFileVideo" />
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
