<template>
  <div
    class="asset-window"
    @drop="drop"
    @dragover="dragover"
    @dragleave="dragleave"
  >
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
      <div v-if="showHint" style="padding: 4px">
        Click "Add File" or Drag and Drop here your video/audio file to link
        asset.
      </div>
    </div>
    <div v-if="canDrop" class="drop-file">
      <div style="margin: auto">Add File</div>
    </div>
  </div>
</template>

<style scoped>
.asset-window {
  border: 1px solid var(--black);
  height: 100%;
  box-sizing: border-box;
  position: relative;
}

.upload-button {
  margin: auto;
  display: flex;
}

.upload-button-container {
  width: 100%;
  padding: 8px;
}

.drop-file {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  background-color: rgba(0 0 0 / 0.5);
  pointer-events: none;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { v4 } from "uuid";
import AssetListItem from "./AssetWindowListItem.vue";
import WindowNameTag from "~/components/vega/WindowNameTag.vue";
import { Asset, AudioAsset, ImageAsset, VideoAsset } from "~/models";
import { VegaError } from "~/plugins/error";
import VegaFileButton from "~/components/vega/VegaFileButton.vue";

@Component({
  components: { AssetListItem, WindowNameTag, VegaFileButton },
})
export default class AssetWindow extends Vue {
  @Prop({
    default: () => [],
  })
  assets!: Asset[];

  selected: null | Asset = null;

  canDrop: boolean = false;

  get showHint() {
    return this.assets.length == 0;
  }

  select(asset: Asset) {
    this.selected = asset;
    this.$emit("changeSelectedAsset", asset);
  }

  dragover(e: DragEvent) {
    e.preventDefault();
    this.canDrop = true;
  }

  dragleave(_: DragEvent) {
    this.canDrop = false;
  }

  addAsset(file: File) {
    if (file.type == "video/mp4") {
      const src = window.URL.createObjectURL(file);
      const asset = new VideoAsset(v4(), file.name, src);
      this.$emit("addAsset", asset);
    } else if (
      file.type == "audio/wav" ||
      file.type == "audio/mp3" ||
      file.type == "audio/mpeg"
    ) {
      const src = window.URL.createObjectURL(file);
      const asset = new AudioAsset(v4(), file.name, src);
      this.$emit("addAsset", asset);
    } else if (file.type == "image/png") {
      const src = window.URL.createObjectURL(file);
      const asset = new ImageAsset(v4(), file.name, src);
      this.$emit("addAsset", asset);
    } else {
      throw new VegaError("Unsupported file type" + file.type);
    }
  }

  drop(e: DragEvent) {
    this.canDrop = false;
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
