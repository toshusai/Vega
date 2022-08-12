<script setup lang="ts">
import { mdiFileMusic } from '@mdi/js'
import { IAsset } from '../core/IAsset'

defineProps<{ asset: IAsset }>()

const videoEl = ref<HTMLVideoElement | null>(null)

onMounted(() => {
  if (!videoEl.value) {
    return
  }
  videoEl.value.currentTime = 20
})
</script>

<template>
  <div style="display: flex; width: 32px">
    <v-icons style="margin: auto" fill="white" :path="mdiFileMusic" />
  </div>
  <div style="margin: auto 0">
    {{ asset.name }}
  </div>
</template>

<style scoped></style>
