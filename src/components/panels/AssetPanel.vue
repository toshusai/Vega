<script setup lang="ts">
import { uuid } from 'short-uuid'

const { assets, addAsset } = useAssets()

function drop (e: DragEvent) {
  e.preventDefault()
  const file = e.dataTransfer?.files[0]
  if (!file) {
    return
  }
  console.log(file)

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
</script>

<template>
  <div class="h-full" @drop="drop" @dragover="dragover">
    <div v-for="(asset, i) in assets.assets" :key="i" class="asset-list-item">
      <component :is="asset.type + 'AssetListItem'" :asset="asset" />
    </div>
  </div>
</template>

<style scoped>
.asset-list-item {
  white-space: nowrap;
  display: flex;
  cursor: pointer;
  height: 32px;
  overflow: hidden;
  border-bottom: 1px solid var(--border-grey);
}

.asset-list-item:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
