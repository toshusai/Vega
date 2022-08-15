<script setup lang="ts">
import { uuid } from 'short-uuid'
import { IAsset } from '~~/src/core/IAsset'

const { assets, addAsset, removeAsset } = useAssets()
const { startDad } = useDragAndDrop()

function drop (e: DragEvent) {
  e.preventDefault()
  const file = e.dataTransfer?.files[0]
  if (!file) {
    return
  }

  addAsset({
    id: uuid(),
    name: file.name,
    path: file.name,
    type: extentionToType(getExt(file.name))
  })
}

function getExt (name: string) {
  return name.split('.').pop() || ''
}

function extentionToType (ext: string) {
  switch (ext) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return 'Image'
    case 'mp4':
    case 'webm':
    case 'ogg':
      return 'Video'
    case 'mp3':
    case 'wav':
      return 'Audio'
    default:
      return 'unknown'
  }
}

function dragover (e: DragEvent) {
  e.preventDefault()
}

function dragstart (e: MouseEvent, id: string) {
  startDad(e, 'assets', id, `asset-list-item-${id}`)
}

function selectAsset (asset: IAsset) {
  assets.value.selectedAssets = [asset]
}

function isSelectedAsset (asset: IAsset) {
  return assets.value.selectedAssets.includes(asset)
}

const el = ref<HTMLElement | null>(null)
const focus = () => {
  el.value?.focus()
}
onMounted(() => {
  el.value?.addEventListener('keydown', (e) => {
    if (e.key === 'x') {
      if (assets.value.selectedAssets.length > 0) {
        removeAsset(assets.value.selectedAssets[0])
      }
    }
  })
})

const isOpenInspector = ref<boolean>(false)
</script>

<template>
  <div
    ref="el"
    style="height: 100%"
    tabindex="0"
    @click="focus"
    @drop="drop"
    @dragover="dragover"
  >
    <div
      v-for="(asset, i) in assets.assets"
      :id="`asset-list-item-${asset.id}`"
      :key="i"
      class="asset-list-item"
      :style="{
        backgroundColor: isSelectedAsset(asset) ? 'darkgray' : 'transparent'
      }"
      @click="() => selectAsset(asset)"
      @mousedown="e => dragstart(e, asset.id)"
    >
      <asset-list-item-base :asset="asset" @click-dots="() => isOpenInspector = true" />
    </div>
    <asset-inspector-modal :is-open="isOpenInspector" @close="() => isOpenInspector = false" />
  </div>
</template>

<style scoped>
.asset-list-item {
  white-space: nowrap;
  user-select: none;
  display: flex;
  cursor: pointer;
  height: 32px;
  overflow: hidden;
  border-bottom: 1px solid var(--border-grey);
  background-color: #111;
  color: #fff;
}

.asset-list-item:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
