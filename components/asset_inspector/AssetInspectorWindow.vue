<template>
  <div class="asset-inspector">
    <WindowNameTag name="Asset Inspector" />
    <div class="container">
      <div v-if="asset">
        <div class="label">Name</div>
        <div class="name">
          {{ asset.name }}
        </div>

        <hr class="hr" />

        <div class="label">Path</div>
        <span v-if="asset.path" class="path" :title="asset.path">
          {{ asset.path }}
        </span>
        <div v-else class="error">Not Found</div>

        <hr class="hr" />

        <div style="display: flex">
          <VegaButton style="margin: auto" @click="uploadFile">
            Link File
          </VegaButton>
          <input
            ref="fileInput"
            type="file"
            style="display: none"
            @change="change"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 4px;
}

.asset-inspector {
  border: 1px solid var(--black);
  height: 100%;
  box-sizing: border-box;
}

.label {
  /* font-size: 12px; */
  font-weight: bold;
}

.path {
  white-space: nowrap;
}

.hr {
  height: 1px;
  margin: 4px 0;
}

.error {
  color: orange;
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Emit, Prop } from "vue-property-decorator";
import VegaButton from "../vega/VegaButton.vue";
import WindowNameTag from "~/components/vega/WindowNameTag.vue";
import { Asset, VideoAsset } from "~/models";

@Component({
  components: { WindowNameTag, VegaButton },
})
export default class AssetInspectorWindow extends Vue {
  @Prop({ default: () => undefined })
  asset!: Asset;

  get fileInput(): HTMLInputElement {
    return this.$refs.fileInput as HTMLInputElement;
  }

  @Emit("changeAsset")
  changeAssetEmit(asset: Asset) {
    return asset;
  }

  change(e: InputEvent) {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files.length == 1) {
      const file = target.files[0];

      const path = window.URL.createObjectURL(file);

      if (this.asset instanceof VideoAsset) {
        const newAsset = new VideoAsset(this.asset.id, this.asset.name, path);
        this.changeAssetEmit(newAsset);
      }
    }
  }

  uploadFile() {
    this.fileInput.click();
  }
}
</script>