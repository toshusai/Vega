<script setup lang="ts">
import { IAsset } from '../core/IAsset'

const props = defineProps<{ isOpen: boolean, }>()
const { assets, updateAsset } = useAssets()
const { init } = useTimeline()

const path = ref('')

const asset = computed(() => {
  return assets.value.selectedAssets.length > 0 ? assets.value.selectedAssets[0] : null
})

watch(() => assets.value.selectedAssets, () => {
  if (asset.value) {
    path.value = asset.value.path
  }
})

const emit = defineEmits<{
    (e: 'close'): void
}>()

function save () {
  emit('close')
  if (asset.value) {
    updateAsset({
      ...asset.value,
      path: path.value
    } as IAsset)
    init()
  }
}

</script>

<template>
  <v-modal :is-open="isOpen" @close="emit('close')">
    <div v-if="asset">
      <div> id</div>
      <div> {{ asset.id }} </div>
      <div> name </div>
      <div> {{ asset.name }} </div>
      <div> path </div>
      <v-string-input :value="path" @input="v => path = v" />
      <button @click="save">
        save
      </button>
    </div>
  </v-modal>
</template>

<style scoped>
</style>
