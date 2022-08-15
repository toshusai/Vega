<script setup lang="ts">
import { mdiFileImage } from '@mdi/js'
import { IAsset } from '../core/IAsset'
import AssetListItemErrorIcon from './AssetListItemErrorIcon.vue'

const props = defineProps<{ asset: IAsset }>()

const img = ref<HTMLImageElement | null>(null)

const error = ref<boolean>(false)

onMounted(() => {
  if (img.value) {
    img.value.src = props.asset.path
    img.value.onerror = () => {
      error.value = true
    }
  }
})

</script>

<template>
  <div style="display: flex; min-width: 32px; position: relative;">
    <v-icons style="margin: auto" fill="white" :path="mdiFileImage" />
    <asset-list-item-error-icon v-if="error" />
  </div>
  <img ref="img" style="display: none;">
  <div style="margin: auto 0">
    {{ asset.name }}
  </div>
</template>
