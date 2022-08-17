<script setup lang="ts">
import { mdiDotsHorizontal } from '@mdi/js'
import { IAsset } from '../core/IAsset'
const props = defineProps<{ asset: IAsset }>()
const emits = defineEmits<{
    (e: 'click-dots'): void
}>()
</script>

<template>
  <div style="display: flex; min-width: 32px; position: relative;">
    <component :is="asset.type.toLowerCase() + '-asset-list-item'" :asset="asset" />
  </div>
  <div style="margin: auto 0; display: flex; width: 100%">
    <div style="margin: auto 0">
      {{ asset.name }}
    </div>
    <button class="icon-button" @click="emits('click-dots')">
      <v-icons style="width: 20px" fill="white" :path="mdiDotsHorizontal" />
    </button>
  </div>
</template>

<style scoped>
.icon-button {
    padding: 0;
    margin: auto 4px auto auto;
    height: 24px;
    width: 24px;
    border-radius: 12px;
}

.icon-button:hover {
    cursor: pointer;
    background-color: #444;
}
</style>
