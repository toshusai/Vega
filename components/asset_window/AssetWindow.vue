<template>
  <div class="asset-window" @drop="drop" @dragover="dragover">
    <window-name-tag name="Assets" />
    <asset-list-item
      v-for="(asset, i) in assets"
      :key="i"
      :asset="asset"
      :selected="selected == asset"
      @click="select(asset)"
    />
    <div class="upload-button-container">
      <VegaFileButton class="upload-button" @change="addAsset">
        Add File
      </VegaFileButton>
    </div>
  </div>
</template>

<style scoped>
.asset-window {
  border: 1px solid var(--black);
  height: 100%;
  box-sizing: border-box;
}

.upload-button {
  margin: auto;
  display: flex;
}

.upload-button-container {
  width: 100%;
  padding: 8px;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { v4 } from "uuid";
import AssetListItem from "./AssetWindowListItem.vue";
import WindowNameTag from "~/components/vega/WindowNameTag.vue";
import { Asset, VideoAsset } from "~/models";
import { VegaError } from "~/plugins/error";

@Component({
  components: { AssetListItem, WindowNameTag },
})
export default class AssetWindow extends Vue {
  @Prop({
    default: () => [],
  })
  assets!: Asset[];

  selected: null | Asset = null;

  select(asset: Asset) {
    this.selected = asset;
    this.$emit("changeSelectedAsset", asset);
  }

  dragover(e: DragEvent) {
    e.preventDefault();
  }

  addAsset(file: File) {
    if (file.type == "video/mp4") {
      const src = window.URL.createObjectURL(file);
      const asset = new VideoAsset(v4(), file.name, src);
      this.$emit("addAsset", asset);
    } else {
      throw new VegaError("Unsupported file type" + file.type);
    }
  }

  drop(e: DragEvent) {
    e.preventDefault();
    const files = e.dataTransfer?.files;
    if (files && files.length == 1) {
      const file = files[0];
      this.addAsset(file);
    } else {
      throw new VegaError("Unsupported drop multiple files.");
    }
  }
}
</script>
