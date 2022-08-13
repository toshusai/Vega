<script setup lang="ts">
import { mdiFileImage } from '@mdi/js'
import { IAsset } from '../core/IAsset'

defineProps<{ asset: IAsset }>()
</script>

<template>
  <div style="display: flex; min-width: 32px">
    <v-icons style="margin: auto" fill="white" :path="mdiFileImage" />
  </div>
  <div style="margin: auto 0">
    {{ asset.name }}
  </div>
</template>
