<script setup lang="ts">
import { mdiFileMusic } from '@mdi/js'
import { IAsset } from '../core/IAsset'

const props = defineProps<{ asset: IAsset }>()

const audio = ref<HTMLVideoElement | null>(null)

const error = ref<boolean>(false)

onMounted(() => {
  if (audio.value) {
    audio.value.src = props.asset.path
    audio.value.onerror = () => {
      error.value = true
    }
  }
})

</script>

<template>
  <div style="display: flex; min-width: 32px; position: relative;">
    <v-icons style="margin: auto" fill="white" :path="mdiFileMusic" />
    <asset-list-item-error-icon v-if="error" />
  </div>
  <audio ref="audio" style="display: none;" />
  <div style="margin: auto 0">
    {{ asset.name }}
  </div>
</template>

<style scoped>
</style>
