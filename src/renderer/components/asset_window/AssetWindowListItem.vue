<template>
  <div
    class="asset-list-item"
    :class="itemClass"
    @click="click"
    @mousedown="mousedown"
  >
    <svg class="asset-icon" viewBox="0 0 24 24">
      <!-- https://materialdesignicons.com/ -->
      <sp-icon v-if="asset.type == 'Video'" name="VideoOutline" />
      <sp-icon v-else-if="asset.type == 'Font'" name="Text" />
      <sp-icon v-else-if="asset.type == 'Audio'" name="Audio" />
      <sp-icon v-else-if="asset.type == 'Image'" name="Image" />
    </svg>
    <div class="asset-name">
      {{ asset.name }}
    </div>
  </div>
</template>

<style scoped>
.asset-list-item {
  cursor: pointer;
  display: flex;
  overflow: hidden;
}

.asset-icon {
  min-width: 20px;
  height: 20px;
  margin: auto 0;
}

.asset-name {
  margin: auto 0 auto 4px;
  white-space: nowrap;
}

.asset-list-item:hover {
  background-color: var(--vc-d-3);
}

.asset-list-item--selected {
  background-color: var(--vc-d-2);
}
</style>

<script lang="ts">
import Vue from "vue";
import { Component, Emit, Prop } from "vue-property-decorator";
import { Asset } from "~/models";
import dragAndDrop from "~/plugins/dragAndDrop";

@Component({})
export default class AssetWindowListItem extends Vue {
  @Prop({ default: () => null })
  asset!: Asset;

  @Prop({ default: false })
  selected!: boolean;

  get itemClass() {
    return this.selected ? ["asset-list-item--selected"] : [];
  }

  @Emit("click")
  clickEmit(e: Event) {
    return e;
  }

  click(e: Event) {
    this.clickEmit(e);
  }

  mousedown(_: MouseEvent) {
    dragAndDrop(this.$el as HTMLElement, this.asset);
  }
}
</script>
