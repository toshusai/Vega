<script setup lang="ts">
import { mdiFileVideo } from '@mdi/js'
import { IAsset } from '../core'

const props = defineProps<{ asset: IAsset }>()

const video = ref<HTMLVideoElement | null>(null)

const error = ref<boolean>(false)

function checkAsset () {
  error.value = false
  if (video.value) {
    video.value.src = props.asset.path
    video.value.onerror = () => {
      error.value = true
    }
  }
}

onMounted(checkAsset)
watch(() => props.asset, checkAsset)
</script>

<template>
  <v-icons style="margin: auto" fill="white" :path="mdiFileVideo" />
  <asset-list-item-error-icon v-if="error" />
  <video ref="video" style="display: none;" />
</template>

<style scoped>
.video {
  min-height: 24px;
  max-height: 24px;
  max-width: 32px;
}
</style>
