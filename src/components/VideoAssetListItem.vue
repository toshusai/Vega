<script setup lang="ts">
import { mdiFileVideo } from '@mdi/js'
import { IAsset } from '../core/IAsset'

const props = defineProps<{ asset: IAsset }>()

const video = ref<HTMLVideoElement | null>(null)

const error = ref<boolean>(false)

onMounted(() => {
  if (video.value) {
    video.value.src = props.asset.path
    video.value.onerror = () => {
      error.value = true
    }
  }
})
</script>

<template>
  <div style="display: flex; min-width: 32px; position: relative;">
    <v-icons style="margin: auto" fill="white" :path="mdiFileVideo" />
    <asset-list-item-error-icon v-if="error" />
  </div>
  <video ref="video" style="display: none;" />
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
