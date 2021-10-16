<template>
  <div class="asset-list-item" :class="itemClass" @click="click">
    <svg class="asset-icon" viewBox="0 0 24 24">
      <!-- https://materialdesignicons.com/ -->
      <path
        v-if="asset.type == 'Video'"
        fill="currentColor"
        d="M15,8V16H5V8H15M16,6H4A1,1 0 0,0 3,7V17A1,1 0 0,0 4,18H16A1,1 0 0,0 17,17V13.5L21,17.5V6.5L17,10.5V7A1,1 0 0,0 16,6Z"
      />
      <path
        v-else-if="asset.type == 'Font'"
        fill="currentColor"
        d="M2 4V7H7V19H10V7H15V4H2M21 9H12V12H15V19H18V12H21V9Z"
      />
      <path
        v-else-if="asset.type == 'Audio'"
        fill="currentColor"
        d="M21,3V15.5A3.5,3.5 0 0,1 17.5,19A3.5,3.5 0 0,1 14,15.5A3.5,3.5 0 0,1 17.5,12C18.04,12 18.55,12.12 19,12.34V6.47L9,8.6V17.5A3.5,3.5 0 0,1 5.5,21A3.5,3.5 0 0,1 2,17.5A3.5,3.5 0 0,1 5.5,14C6.04,14 6.55,14.12 7,14.34V6L21,3Z"
      />
      <path
        v-else-if="asset.type == 'Image'"
        fill="currentColor"
        d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z"
      />
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
}
</script>
