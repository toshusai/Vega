<script setup lang="ts">
import { uuid } from 'short-uuid'

const { assets, addAsset } = useAssets()
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
</script>

<template>
  <div style="height: 100%" @drop="drop" @dragover="dragover">
    <div v-for="(asset, i) in assets.assets" :id="`asset-list-item-${asset.id}`" :key="i" class="asset-list-item" @mousedown="e => dragstart(e, asset.id)">
      <component :is="asset.type.toLowerCase() + '-asset-list-item'" :asset="asset" />
    </div>
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
  padding: 0 8px;
  color: #fff;
}

.asset-list-item:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
