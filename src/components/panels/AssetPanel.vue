<script setup lang="ts">
const { assets } = useAssets();
</script>

<template>
  <div v-for="(asset, i) in assets.assets" :key="i" class="asset-list-item">
    <component :is="asset.type + 'AssetListItem'" :asset="asset" />
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
