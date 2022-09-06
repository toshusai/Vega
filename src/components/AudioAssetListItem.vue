<script setup lang="ts">
import { mdiFileMusic } from '@mdi/js'
import { IAsset } from '../core'

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
  <v-icons style="margin: auto" fill="white" :path="mdiFileMusic" />
  <asset-list-item-error-icon v-if="error" />
  <audio ref="audio" style="display: none;" />
</template>

<style scoped>
</style>
