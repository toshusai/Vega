<template>
  <div class="asset-inspector">
    <div class="container">
      <div v-if="asset">
        <sp-field-label>Name</sp-field-label>
        <div class="name">
          {{ asset.name }}
        </div>

        <sp-field-label>Path</sp-field-label>
        <span v-if="asset.path" class="path" :title="asset.path">
          {{ asset.path }}
        </span>
        <div v-else class="error">Not Found</div>

        <div style="display: flex">
          <sp-button
            size="S"
            type="secondary"
            style="margin: 16px auto"
            @click="uploadFile"
          >
            Link File
          </sp-button>
          <input
            ref="fileInput"
            type="file"
            style="display: none"
            @change="change"
          />
        </div>
        <div style="display: flex">
          <sp-button
            style="margin: auto"
            size="S"
            type="negative"
            @click="deleteAsset"
          >
            delete
          </sp-button>
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
import WindowNameTag from "~/components/vega/WindowNameTag.vue";
import { Asset, ImageAsset, VideoAsset, AudioAsset } from "~/models";
import { VegaError } from "~/plugins/error";
import { isElectron } from "~/plugins/utils/isElectron";

@Component({
  components: { WindowNameTag },
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
      // @ts-ignore
      const p = file.path;
      const path = isElectron()
        ? `file://` + p
        : window.URL.createObjectURL(file);

      if (this.asset instanceof VideoAsset) {
        if (!VideoAsset.isSupportType(file.type)) {
          throw new VegaError(`Invalid file type ${file.type} to Video.`);
        }
        const newAsset = new VideoAsset(this.asset.id, this.asset.name, path);
        this.changeAssetEmit(newAsset);
      } else if (this.asset instanceof ImageAsset) {
        if (!ImageAsset.isSupportType(file.type)) {
          throw new VegaError(`Invalid file type ${file.type} to Image.`);
        }
        const newAsset = new ImageAsset(this.asset.id, this.asset.name, path);
        this.changeAssetEmit(newAsset);
      } else if (this.asset instanceof AudioAsset) {
        if (!AudioAsset.isSupportType(file.type)) {
          throw new VegaError(`Invalid file type ${file.type} to Audio.`);
        }
        const newAsset = new AudioAsset(this.asset.id, this.asset.name, path);
        this.changeAssetEmit(newAsset);
      } else {
        throw new VegaError("Sorry under implementation.");
      }
      // TODO Fix render update.
      // Look like the asset does not updated in view.
    }
  }

  uploadFile() {
    this.fileInput.click();
  }

  deleteAsset() {
    this.$emit("deleteAsset");
  }
}
</script>